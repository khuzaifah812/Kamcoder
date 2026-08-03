# Accepts marks
# marks = int(input("ENTER MARKS:\n"))
marks =0;

#Grading Scale
while marks <=0:
    #print("MARKS CANNOT BE ZERO OR NEGATIVE!!")
    marks = int(input("ENTER MARKS::!\n"))
    if marks < 0:
        print("MARKS CANNOT BE  NEGATIVE!!")
        continue
    elif marks == 0:
        print("MARKS CANNOT BE ZERO  ")
        continue

if marks >= 80 and marks <=100:
    print("GRADE  A")
    
elif marks >= 70 and marks <=79:
    print("GRADE  B")
elif marks >= 60 and marks <=69:
    print("GRADE  C")
elif marks >= 50 and marks <=59:
    print("GRADE  D")  
elif  marks >= 1 and marks <=49:
    print("GRADE  F")             
    

