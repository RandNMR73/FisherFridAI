def prompt_to_list(content):
    # remove the square brackets
    content = content[1:-1]

    # Extract the list of specific goals from Claude's response
    specific_goals = [goal.strip() for goal in content.split('|') if goal.strip()]

    return specific_goals