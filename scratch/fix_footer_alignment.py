
import os

def fix_layout_css():
    path = 'assets/css/home-split.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update body to flex-direction: column
    content = content.replace(
        'justify-content: center; ',
        'justify-content: center; \n  flex-direction: column; '
    )
    
    # 2. Update .gateway-minimal to flex: 1 and center content
    content = content.replace(
        '.gateway-minimal { \n  display: flex; \n  flex-direction: column; \n  align-items: center; \n  text-align: center; \n  padding: 2rem; \n  width: 100%; \n  max-width: 1200px; \n  animation: fadeIn 1.5s ease; \n  position: relative;\n  z-index: 1;\n}',
        '.gateway-minimal { \n  display: flex; \n  flex-direction: column; \n  align-items: center; \n  justify-content: center; \n  text-align: center; \n  padding: 2rem; \n  width: 100%; \n  flex: 1; \n  max-width: 1200px; \n  animation: fadeIn 1.5s ease; \n  position: relative;\n  z-index: 1;\n}'
    )
    
    # 3. Clean up the footer CSS added earlier
    # Ensure footer is simple block
    if 'footer {' in content:
        import re
        content = re.sub(r'footer \{[^}]+\}', 
                         'footer {\n    width: 100%;\n    background-color: #000000;\n    padding: 20px 0;\n    text-align: center;\n    position: relative;\n    z-index: 999;\n    clear: both;\n    border-top: 1px solid #222;\n}', 
                         content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_layout_css()
