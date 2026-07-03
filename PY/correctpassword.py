# attempts 3 login
correct_password = ("khuzaifah1234")
attempt = 0

for attempt in range(4):
    password = input("ENTER YOUR PASSWORD")
    
    if password == correct_password:
        print("LOGIN SUCCESSFUL")
        break
    else:
        print("WRONG PASSWORD")
        max_attempts = 3-attempt
        print(f"REMAINING {max_attempts} ATTEMPTS:")
else:
    print("ACCOUNT LOCKED")
    