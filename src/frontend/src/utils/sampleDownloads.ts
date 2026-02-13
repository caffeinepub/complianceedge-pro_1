/**
 * Utility for safely downloading sample CSV files with HTML fallback detection.
 * Prevents downloading HTML error pages disguised as CSV files.
 */

export async function downloadSampleFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download sample file: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const blob = await response.blob();
    
    // Check if response is HTML (SPA fallback)
    if (contentType.includes('text/html')) {
      throw new Error('Sample file is not available. Please contact support.');
    }

    // Additional check: read first few bytes to detect HTML
    const text = await blob.slice(0, 100).text();
    if (text.trim().toLowerCase().startsWith('<!doctype html') || 
        text.trim().toLowerCase().startsWith('<html')) {
      throw new Error('Sample file is not available. Please contact support.');
    }

    // Trigger download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to download sample file';
    throw new Error(message);
  }
}
