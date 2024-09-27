import os

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        return file.read()

def get_excluded_directories(directories):
    excluded_dirs = []
    while True:
        print("\nMöchtest du ein Verzeichnis ausschließen? (Gib die Nummer an, oder drücke 'enter' für alle behalten):")
        for i, dir_name in enumerate(directories):
            print(f"{i}: {dir_name}")

        user_input = input("Nummer des auszuschließenden Verzeichnisses (oder 'enter' für Fertig): ").strip()
        
        if user_input == '':
            break
        
        try:
            dir_index = int(user_input)
            if 0 <= dir_index < len(directories):
                excluded_dirs.append(directories[dir_index])
                print(f"Verzeichnis '{directories[dir_index]}' wird ausgeschlossen.")
            else:
                print("Ungültige Nummer, versuche es erneut.")
        except ValueError:
            print("Bitte gib eine gültige Nummer ein.")
    
    return excluded_dirs

directory = './'
main_dirs = [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d))]
excluded_dirs = get_excluded_directories(main_dirs)
extensions = ['.js', '.vue', '.json']
output_file = 'output.txt'

with open(output_file, 'w', encoding='utf-8') as out:
    for root, dirs, files in os.walk(directory):
        if root == directory:
            dirs[:] = [d for d in dirs if d not in excluded_dirs]
        
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                relative_path = os.path.relpath(os.path.join(root, file), directory)
                file_content = read_file(os.path.join(root, file))
                out.write(f'### ***{relative_path}*** ###\n')
                out.write(f'```\n{file_content}\n```\n\n')

print(f'Die Datei {output_file} wurde erfolgreich erstellt.')