import os
import re

def fix_imports_in_file(file_path):
    """Fix import paths in a Python file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix backend. imports
    content = re.sub(r'from backend\.', 'from ', content)
    content = re.sub(r'import backend\.', 'import ', content)
    
    # Fix relative imports
    content = re.sub(r'from \.\.', 'from ', content)
    content = re.sub(r'from \.', 'from ', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed imports in {file_path}")

def fix_all_imports():
    """Fix imports in all Python files"""
    backend_dir = "backend"
    
    for root, dirs, files in os.walk(backend_dir):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    fix_imports_in_file(file_path)
                except Exception as e:
                    print(f"Error fixing {file_path}: {e}")

if __name__ == "__main__":
    fix_all_imports()
    print("All imports fixed!")
