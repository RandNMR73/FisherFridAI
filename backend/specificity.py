import re
import anthropic

import claude_helper


def get_specificity_score(learning_goal):
    client = anthropic.Anthropic()

    # message = client.messages.create(
    #     model="claude-3-5-sonnet-20240620",
    #     max_tokens=100,
    #     temperature=0,
    #     system="You are an all knowing AI Mentor with the goal of helping students in a compassionate way. A student will "
    #            "provide you with a learning goal and you will evaluate it for its specificity, considering how broad the "
    #            "topic is to understand. Reply wtih a single integer between 0 and 100 indicating the specificty. If it is "
    #            "very broad, give it a low score, if it is very specific give it a high score.",
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": [
    #                 {
    #                     "type": "text",
    #                     "text": f"{learning_goal}"
    #                 }
    #             ]
    #         }
    #     ]
    # )
    #
    # content = message.content[0].text
    
    prompt_prefix = "A student will " "provide you with a learning goal and you will evaluate it for its specificity, considering how broad the " "topic is to understand. ALWAYS Reply wtih a SINGLE integer between 0 and 100 indicating the specificty. If it is " "very broad, give it a low score, if it is very specific give it a high score."
    total_prompt = prompt_prefix + learning_goal
    content = claude_helper.call_claude(total_prompt, num_predict=100)

    # content = claude_helper.call_claude(system_prompt="A student will "
    #            "provide you with a learning goal and you will evaluate it for its specificity, considering how broad the "
    #            "topic is to understand. ALWAYS Reply wtih a SINGLE integer between 0 and 100 indicating the specificty. If it is "
    #            "very broad, give it a low score, if it is very specific give it a high score.",
    #            user_prompt=f"{learning_goal}",
    #            max_tokens=100,
    #            temperature=0)

    # Use regex to find the first number in the string
    match = re.search(r'\d+', content)

    if match:
        score = int(match.group())
        if 0 <= score <= 100:
            return score
        else:
            raise ValueError("Score is not between 0 and 100.")
    else:
        raise ValueError("No valid number found in the response.")


# Example usage
learning_goal = "Computer science"
specificity_score = get_specificity_score(learning_goal)
print(f"Specificity score: {specificity_score}")
