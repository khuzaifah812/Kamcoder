rows = int(input("ENTER THE NUMBER OF ROWS:\t"))
columns = int(input("ENTER THE Number OF COLUMNS:\t"))
symbols = (input("ENTER THE SYMBOLE TO USE:\t"))

for x in range(rows):
    for y in range(columns):
        print(symbols, end=" ")
    print()
