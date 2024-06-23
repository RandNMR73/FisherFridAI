import anthropic


def call_claude(system_prompt, user_prompt, max_tokens=100, temperature=0):
    client = anthropic.Anthropic()

    message = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=max_tokens,
        temperature=temperature,
        system="You are an all knowing AI Mentor with the goal of helping students in a compassionate way. "
               + system_prompt,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_prompt
                    }
                ]
            }
        ]
    )

    return message.content[0].text