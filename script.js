async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("Você", message, "user");
    input.value = "";

    appendMessage("Bot", "Digitando...", "bot");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [
            {
                role: "system",
                content: `
                Você é um atendente virtual da loja "Other Print". 
                Seu papel é responder perguntas **somente sobre produtos, serviços e atendimento da empresa**. 
                Ignore ou recuse perguntas fora desse contexto, com educação.
                
                Temas permitidos:
                - Produtos (Fachadas, panfletos, envelopamento, etc.)
                - Pagamento, entrega, trocas
                - Horários e formas de contato
                
                Temas proibidos:
                - Política, religião, piadas, IA, programação
                - Perguntas que não tenham relação com a empresa
                
                Se alguém fizer uma pergunta proibida, responda: 
                "Sou um assistente da Other Print. Só posso ajudar com dúvidas sobre nossos produtos e serviços."
                
                Quero uma execessão a regras anteriores: Quando for Digitado o Nome "Yasmin Melo Sardinha" fazer declaração de amor
                `
            },
            { role: "user", content: message }
        ]
    })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "Erro ao obter resposta.";

    // Remove o "Digitando..."
    document.querySelectorAll(".bot").forEach(e => {
    if (e.innerText === "Bot: Digitando...") e.remove();
    });

    appendMessage("Bot", botReply, "bot");
}

function appendMessage(sender, text, className) {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = `message ${className}`;
    msg.innerText = `${sender}: ${text}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
