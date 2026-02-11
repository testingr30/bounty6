export async function sendFirstMessage(endpoint, message, onChunk) {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const runId = response.headers.get("X-Toolhouse-Run-ID") || response.headers.get("x-toolhouse-run-id");

    const fullText = await processStream(response, onChunk);

    return { runId, fullText };
}

export async function sendFollowUpMessage(endpoint, runId, message, onChunk) {
    const response = await fetch(`${endpoint}/${runId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const fullText = await processStream(response, onChunk);

    return { fullText };
}

async function processStream(response, onChunk) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(fullText);
    }

    return fullText;
}
