from typing import Union, Literal


class Calculator:
    def add(self, x: float, y: float) -> float:
        return x + y

    def subtract(self, x: float, y: float) -> float:
        return x - y

    def multiply(self, x: float, y: float) -> float:
        return x * y

    def divide(self, x: float, y: float) -> float | Literal["Cannot divide by zero"]:
        if y == 0:
            return "Cannot divide by zero"
        return x / y


calculator: Calculator = Calculator()

while True:
    print("Options:")
    print("Enter 'add' for addition")
    print("Enter 'subtract' for subtraction")
    print("Enter 'multiply' for multiplication")
    print("Enter 'divide' for division")
    print("Enter 'exit' to end the program")

    user_input: str = input("Enter option : ")

    if user_input == "exit":
        break
    if user_input in ["add", "subtract", "multiply", "divide"]:
        num1: float = float(input("Enter first number: "))
        num2: float = float(input("Enter second number: "))
        if user_input == "add":
            print("Result:", calculator.add(num1, num2))
        elif user_input == "subtract":
            print("Result:", calculator.subtract(num1, num2))
        elif user_input == "multiply":
            print("Result:", calculator.multiply(num1, num2))
        elif user_input == "divide":
            print("Result:", calculator.divide(num1, num2))
    else:
        print("Invalid input")
