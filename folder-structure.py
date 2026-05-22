import os

# Folders to ignore
IGNORE_DIRS = {
    "node_modules",
    ".git",
    "dist",
    ".angular",
    ".idea",
    "__pycache__"
}

def print_tree(path, prefix=""):
    try:
        items = sorted(os.listdir(path))
    except PermissionError:
        return

    items = [item for item in items if item not in IGNORE_DIRS]

    for index, item in enumerate(items):
        full_path = os.path.join(path, item)
        connector = "└── " if index == len(items) - 1 else "├── "

        print(prefix + connector + item)

        if os.path.isdir(full_path):
            extension = "    " if index == len(items) - 1 else "│   "
            print_tree(full_path, prefix + extension)

if __name__ == "__main__":
    project_path = os.getcwd()   # current folder
    print(f"\n📁 NestJS Project Structure: {project_path}\n")
    print_tree(project_path)
