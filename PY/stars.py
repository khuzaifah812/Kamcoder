# Accepts a password from the user
password = input("Enter your password: ")
has_uppercase = False
has_digit = False
# checks if length atleasst 8 character
# checks if contaains uppercase at start
# checks if contains at least one number

while True:
    if not has_uppercase:
        for char in password:
            if char.isupper():
                has_uppercase = True
                break
        if not has_uppercase:
            print("Password must contain at least one uppercase letter.")
            password = input("Enter your password: ")
            continue

    elif not has_digit:
        for char in password:
            if char.isdigit():
                has_digit = True
                break
        if not has_digit:
            print("Password must contain at least one digit.")
            password = input("Enter your password: ")
            continue
    elif not len(password) >= 8:
        for char in password:
            if len(password)>=8:
                break
        if not len(password) >=8:
            print("Password must contain atleast 8 digits.")
            password = input("Enter your password: ")
            continue

    # If both conditions are satisfied, break the loop
    break
print("CORRECT PASSWORD ACCESS GRANTED")
