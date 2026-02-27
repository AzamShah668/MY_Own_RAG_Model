from typing import List, Optional
from groq import Groq
from app.config import settings

class LLMInterface:
    """
    Interface for interacting with the Groq LPU™ Inference Engine.
    Provides high-speed generation using models like Llama 3.
    """
    
    def __init__(self):
        """
        Initializes the Groq client using credentials from the environment.
        """
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
        else:
            self.client = None

    def generate_answer(self, query: str, context_chunks: List[str]) -> str:
        """
        Generates a contextual answer based on retrieved documents.
        
        Args:
            query (str): The user's question.
            context_chunks (List[str]): Relevant text fragments from the vector database.
            
        Returns:
            str: The AI-generated response.
        """
        if not self.client:
            return (
                "[SIMULATED RESPONSE]\n"
                "Groq API key is missing in .env. "
                "Context chunks received: " + str(len(context_chunks))
            )

        context_text = "\n---\n".join(context_chunks)
        
        messages = [
            {
                "role": "system", 
                "content": (
                    "You are a professional intelligence assistant. Answer the user's question using ONLY the provided context. "
                    "If the answer is not in the context, politely state that you cannot find the information.\n\n"
                    "FORMATTING RULES:\n"
                    "1. Use professional Markdown formatting.\n"
                    "2. Use bold text for key terms and disease names.\n"
                    "3. Use bullet points or numbered lists for summaries or multiple points.\n"
                    "4. Use clear headings if the answer is long.\n"
                    "5. Ensure there is proper spacing between paragraphs and list items for readability.\n"
                    "6. Keep the tone clinical and precise."
                )
            },
            {
                "role": "user", 
                "content": f"CONTEXT MATERIAL:\n{context_text}\n\nUSER QUESTION: {query}"
            }
        ]

        try:
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.1,  # Low temperature for factual accuracy
                max_tokens=1024
            )
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            return f"Error during Groq inference: {str(e)}"

if __name__ == "__main__":
    # Quick test
    llm = LLMInterface()
    print(llm.generate_answer("Who are you?", ["Context chunk 1"]))
