# Validate username
while True:
     username = input("ENTER YOUR ACCOUNT USERNAME:\n")
     
     
     if len(username)>8:
         print("USERNAME MUST NOT BE GREATER THAN 8 LETTERS, ENTER AGAIN:!\n")
     elif username.isdigit():
         print("USERNAME MUST  CONTAIN LETTERS, ENTER AGAIN:!\n")
     elif username!=username.upper():
         print("USERNAME MUST BE IN CAPITAL LETTERS, ENTER AGAIN:!\n")
     elif username == (" "):
         print("NO USERNAME ENTERED!!!, EMPTY FIELD")        
     elif username.isalpha():
         print(f"USERNAME CORRECT , YOUR USERNAME IS {username}")
         break         
     else:
         print("WRONG USERNAME, ENTER AGAIN:!\n")
         
         
         
         
     
    
