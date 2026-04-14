
import os

def cleanup_footer_css():
    path = 'assets/css/home-split.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the broken footer block
    import re
    # Find everything from /* INSERÇÃO DE RODAPÉ PROFISSIONAL (CIRÚRGICO) */ to the end
    content = re.sub(r'/\* INSERÇÃO DE RODAPÉ PROFISSIONAL.*', '', content, flags=re.DOTALL)
    
    # Re-append the clean version
    footer_css = """
/* INSERÇÃO DE RODAPÉ PROFISSIONAL (CIRÚRGICO) */
footer {
    width: 100%;
    background-color: #000000;
    padding: 20px 0;
    text-align: center;
    position: relative;
    z-index: 999;
    clear: both;
    border-top: 1px solid #222;
}
.footer-text {
    color: #888888;
    font-size: 0.85rem;
    margin: 0;
    font-family: Arial, sans-serif;
}
/* Ajuste para Mobile */
@media (max-width: 768px) {
    footer {
        margin-top: 50px;
    }
}
"""
    content = content.strip() + "\n" + footer_css
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    cleanup_footer_css()
