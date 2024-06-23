from flask import jsonify
from backend import claude_helper
from backend.prompt_to_list import prompt_to_list


class TreeNode:
    def __init__(self, topic):
        self.topic = topic
        self.prerequisites = []
        self.comfort_level = -2


class KnowledgeTree:
    def __init__(self, topic):
        self.root = TreeNode(topic)

    def add_node(self, new_node, parent_topic=None):
        if not self.root:
            self.root = new_node
        elif parent_topic:
            parent_node = self.find_node(self.root, parent_topic)
            if parent_node:
                parent_node.prerequisites.append(new_node)
        return new_node

    def find_node(self, current_node, topic):
        if current_node.topic == topic:
            return current_node
        for prereq in current_node.prerequisites:
            found = self.find_node(prereq, topic)
            if found:
                return found
        return None

    def get_all_uncomfortable_nodes(self, current_node, uncomfortable_nodes=None):
        if uncomfortable_nodes is None:
            uncomfortable_nodes = []
        if int(current_node.comfort_level) < 0:
            uncomfortable_nodes.append(current_node)
        for prereq in current_node.prerequisites:
            self.get_all_uncomfortable_nodes(prereq, uncomfortable_nodes)
        return uncomfortable_nodes

    def get_all_comfortable_nodes(self, current_node, comfortable_nodes=None):
        if comfortable_nodes is None:
            comfortable_nodes = []
        if current_node.comfort_level >= 0:
            comfortable_nodes.append(current_node)
        for prereq in current_node.prerequisites:
            self.get_all_comfortable_nodes(prereq, comfortable_nodes)
        return comfortable_nodes

    def get_first_uncomfortable_node(self, current_node):
        # If the current node has no prerequisites, it's a leaf
        if not current_node.prerequisites:
            # If it's uncomfortable, return it
            if int(current_node.comfort_level) < 0:
                return current_node
            # If it's comfortable, return None
            return None

        # If it's not a leaf, check all children
        for child in current_node.prerequisites:
            result = self.get_first_uncomfortable_node(child)
            if result:
                return result

        # If no uncomfortable leaf found in any branch, return None
        return None

    def get_leaves(self, current_node=None, leaves=None):
        if current_node is None:
            current_node = self
        if leaves is None:
            leaves = []
        if not current_node.prerequisites:
            leaves.append(current_node)
        for prereq in current_node.prerequisites:
            self.get_leaves(prereq, leaves)
        return leaves


def get_prerequisite_information(tree, topic):
    node = tree.find_node(tree.root, topic)
    if not node:
        return jsonify({'error': 'Topic not found in tree'}), 404

    if node.comfort_level >= 0:
        return jsonify({'prerequisites': []}), 200

    # Check if the node already has prerequisites
    if node.prerequisites:
        return jsonify({'prerequisites': [prereq.topic for prereq in node.prerequisites]}), 200

    content = claude_helper.call_claude(
        system_prompt="You are helping to generate the immediate prerequisite information for a user to be able to learn about this topic. Given a broad learning goal, provide the immediate simpler prerequisites for a user to be able to learn about this topic. The response should be a list of 2-5 items, each should be a topic that follows the format 'How comfortable are you with ...' . The 2-5 values should ALWAYS be seperated by '|' symbols and are ALWAYS enclosed by square brackets ([]), do not ever stray away from this format or provide fluff at the start or end.",
        user_prompt=f"{topic}",
        max_tokens=400
    )

    if not content.startswith('[') or not content.endswith(']'):
        return jsonify({'error': 'Response is not enclosed in square brackets. ' + content}), 402

    specific_prereqs = prompt_to_list(content)

    cleaned_prereqs = [prereq.replace("The user should know ", "").strip() for prereq in specific_prereqs]
    cleaned_prereqs = [prereq.replace("The user should ", "").strip() for prereq in cleaned_prereqs]

    # Add prerequisites to the tree
    for prereq in cleaned_prereqs:
        tree.add_node(TreeNode(prereq), topic)

    return jsonify({'prerequisites': cleaned_prereqs}), 200


def add_info(tree, topic, comfort_level):
    node = tree.find_node(tree.root, topic)
    if not node:
        return jsonify({'error': 'Topic not found in tree'}), 404

    node.comfort_level = comfort_level  # Update the comfort level

    # Only generate prerequisites if the comfort level is below 0 and the node has no prerequisites
    if int(comfort_level) < 0 and not node.prerequisites:
        response, code = get_prerequisite_information(tree, topic)
        if code != 200:
            raise Exception(response.json['error'])



