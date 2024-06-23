import anthropic
from flask import Flask, request, jsonify
from flask_cors import CORS

from backend import claude_helper
from backend.prompt_to_list import prompt_to_list
from backend.specificity import get_specificity_score
from backend.tree_of_knowledge import TreeNode, KnowledgeTree, get_prerequisite_information, add_info

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://verylocal:3000"}})

# Global knowledge tree
knowledge_tree = None


@app.route('/api/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data_request = request.get_json()
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

    content = claude_helper.call_claude(
        system_prompt="You are helping to generate more specific learning goals. Given a broad learning goal, divide the goal into 2-5 more specific sections. Provide ONLY a list of these 2-5 sections. They should ALL start with 'I want to learn '. They should ALWAYS be seperated by '|' symbols and are ALWAYS enclosed by square brackets ([]), do not ever stray away from this format or provide fluff at the start or end.",
        user_prompt=f"{prompt}",
        max_tokens=400)

    if not content.startswith('[') or not content.endswith(']'):
        return jsonify({'error': 'Response is not enclosed in square brackets. ' + content}), 402

    specific_goals = prompt_to_list(prompt)

    for i, goal in enumerate(specific_goals):
        if not goal.startswith('I want to learn '):
            return jsonify({'error': f'Goal {i + 1} does not start with "I want to learn "'}), 403
        else:
            if goal.startswith('I want to learn about '):
                specific_goals[i] = goal[22:]
            else:
                specific_goals[i] = goal[16:]

    specific_goals.insert(0, specificity_score)

    return jsonify({'result': specific_goals})


@app.route('/prereq', methods=['POST'])
def get_prerequisites():
    global knowledge_tree
    data = request.json
    topic = data.get('prompt')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    if not knowledge_tree:
        knowledge_tree = KnowledgeTree(topic)
        add_info(knowledge_tree, topic, -2)

    response, status_code = get_prerequisite_information(knowledge_tree, topic)

    if status_code != 200:
        return response, status_code

    prerequisites = response.json['prerequisites']

    def generate_tree_string(node, level=0):
        tree_string = f'Level {level}: {"  " * level}{node.topic}\n'
        for prereq in node.prerequisites:
            tree_string += generate_tree_string(prereq, level + 1)
        return tree_string

    tree_string = generate_tree_string(knowledge_tree.root)

    return jsonify({
        'prerequisites': prerequisites,
        'tree': tree_string
    }), 200


@app.route('/set_up_tree', methods=['POST'])
def set_up_tree():
    global knowledge_tree
    data = request.json
    topic = data.get('topic')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    knowledge_tree = KnowledgeTree(topic)
    add_info(knowledge_tree, topic, -2)

    return jsonify({'message': 'Knowledge tree initialized'}), 200


@app.route('/get_next_uncomfortable', methods=['GET'])
def get_next_uncomfortable():
    global knowledge_tree
    if not knowledge_tree:
        return jsonify({'error': 'Knowledge tree not initialized'}), 400

    leaves = knowledge_tree.get_leaves(knowledge_tree.root)
    done = True
    for leaf in leaves:
        if leaf.comfort_level < 0:
            done = False
            break
    if done:
        return jsonify({'message': 'All topics are comfortable'}), 200

    next_uncomfortable = knowledge_tree.get_first_uncomfortable_node(knowledge_tree.root)
    print("PY", next_uncomfortable.topic)

    if not next_uncomfortable:
        return jsonify({'message': 'All topics are comfortable'}), 200

    return jsonify({'next_uncomfortable': next_uncomfortable.topic}), 200


@app.route('/add_info', methods=['POST'])
def add_comfort_info():
    global knowledge_tree
    data = request.json
    topic = data.get('topic')
    comfort_level = data.get('comfort_level')

    if not topic or comfort_level is None:
        return jsonify({'error': 'Topic and comfort level are required'}), 400

    try:
        add_info(knowledge_tree, topic, comfort_level)
        return jsonify({'message': 'Comfort level updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/print_tree', methods=['GET'])
def print_tree():
    global knowledge_tree
    if not knowledge_tree:
        return jsonify({'error': 'Knowledge tree not initialized'}), 400

    def generate_tree_string(node, level=0):
        tree_string = f'Level {level}: {"  " * level}{node.topic} ({node.comfort_level})\n'
        for prereq in node.prerequisites:
            tree_string += generate_tree_string(prereq, level + 1)
        return tree_string

    tree_string = generate_tree_string(knowledge_tree.root)

    return jsonify({'tree': tree_string}), 200

if __name__ == '__main__':
    app.run(debug=True)
