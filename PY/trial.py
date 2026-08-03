#calculate the compount interest
name = input("ENTER YOUR NAME!!")

# loop user input

while name=="":
    print("YOU DIDT TYPE IN ANYTHING")
    name = input("ENTER YOUR NAME!!")
print(f"HELLO {name}")

principle=0
rate=0
time=0

while principle <=0:
    principle= float(input("ENTER PRINCIPLE AMMOUNT"))
    if principle <=0:
        print("ENTER PRINCIPLE AGAIN!1")
        
while rate <=0:
    rate= float(input("ENTER RATE AMMOUNT"))
    if rate <=0:
        print("ENTER RATe AGAIN!1")

while time <=0:
    time= float(input("ENTER TIME AMMOUNT"))
    if time <=0:
        print("ENTER TIME AGAIN!1")
        
#calculations        
print(f"principle is {principle}")
print(f"rate is {rate}")
print(f"time is {time}")

total= principle*pow((1+rate/100),time)
print(f"COMPOUND INTEREST is {total}")
    