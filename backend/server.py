import anthropic
from flask import Flask, request, jsonify
from flask_cors import CORS

from backend import claude_helper
from backend.specificity import get_specificity_score

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://verylocal:3000"}})


@app.route('/api/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data_request = request.get_json()
        # Process data
        return jsonify({'message': 'Data received', 'data': data_request})

    if request.method == 'GET':
        return jsonify({'message': 'Data received', 'data': 'Hello World'})

    else:
        return jsonify({'message': 'Send some data'})


@app.route('/message', methods=['GET'])
def message():
    return jsonify({'message': 'Hello from the backend!'})


@app.route('/specify', methods=['POST'])
def specify():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 401

    specificity_score = get_specificity_score(prompt)

    if specificity_score >= 40:  # You can adjust this threshold as needed
        return jsonify({'result': ['done']})
    else:
        content = claude_helper.call_claude(
            system_prompt="You are helping to generate more specific learning goals. Given a broad learning goal, divide the goal into 2-5 more specific sections. Provide ONLY a list of these 2-5 sections. They should ALL start with 'I want to learn '. They should ALWAYS be seperated by '|' symbols and are ALWAYS enclosed by square brackets ([]), do not ever stray away from this format or provide fluff at the start or end.",
            user_prompt=f"{prompt}",
            max_tokens=400)

        # assert that the response is enclosed in square brackets
        if not content.startswith('[') or not content.endswith(']'):
            return jsonify({'error': 'Response is not enclosed in square brackets. ' + content}), 402

        # remove the square brackets
        content = content[1:-1]

        # Extract the list of specific goals from Claude's response
        specific_goals = [goal.strip() for goal in content.split('|') if goal.strip()]

        # for each specific goal, check if it is a continuation of "I want to learn about "
        for i, goal in enumerate(specific_goals):
            if not goal.startswith('I want to learn '):
                return jsonify({'error': f'Goal {i + 1} does not start with "I want to learn "'}), 403
                # 1 + 1
            else:
                if goal.startswith('I want to learn about '):
                    specific_goals[i] = goal[22:]
                else:
                    specific_goals[i] = goal[16:]

        return jsonify({'result': specific_goals})


if __name__ == '__main__':
    app.run(debug=True)
