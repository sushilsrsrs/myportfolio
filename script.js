
        const API_ENDPOINT = 'http://localhost:3000/chat';

        async function sendMessage() {
            const input = document.getElementById('user-input');
            const messages = document.getElementById('chat-messages');
            
            if (!input.value.trim()) return;

            // Add user message
            messages.innerHTML += `
                <div class="message user-message">
                    ${input.value}
                </div>
            `;

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: input.value })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                messages.innerHTML += `
                    <div class="message bot-message">
                        ${data.reply}
                    </div>
                `;

            } catch (error) {
                console.error('Error:', error);
                messages.innerHTML += `
                    <div class="message bot-message">
                        ❌ Error: ${error.message}
                    </div>
                `;
            }

            input.value = '';
            messages.scrollTop = messages.scrollHeight;
        }

        // Handle Enter key
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
   