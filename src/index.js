// Select input display element, assign to variable
const input = document.querySelector("#input")

// Initialize state variables
let n1 = ""
let n2 = ""
let operator = ""
let equalsJustPressed = false
let operatorJustPressed = false


const handleNumberClick = (event) => {
    const number = event.target.value

    // If equals was just pressed, or operator was just pressed, reset the screen and set n2 (second operand)
    if (input.innerText === "0" || equalsJustPressed || operatorJustPressed) {
        input.innerText = number // Replace the input with the new number
    } else {
        input.innerText += number // Otherwise, append the number to the screen
    }

    // If an operator was pressed, this is the start of n2 (second operand)
    if (operator) {
        n2 += number
    }

    operatorJustPressed = false
    equalsJustPressed = false
}

// Handle point/decimal button click
const handlePointClick = () => {
    if (operator || equalsJustPressed || !input.innerText) {
        input.innerText = "0."
    }

    if (!input.innerText.includes(".")) {
        input.innerText += "."
    }

    operatorJustPressed = false
    equalsJustPressed = false
}

// Handle sign button click
const handleSignClick = () => {
    let value = parseFloat(input.innerText)

    // If value isn't zero, negate it
    if (value !== 0) {
        value = -value;
        input.innerText = value.toString()
    }

    operatorJustPressed = false
    equalsJustPressed = false
}

// Handle clear button click
const handleClearClick = (event) => {
    // Reset everything to initial state
    input.innerText = "0"
    n1 = ""
    n2 = ""
    operator = ""
    equalsJustPressed = false
    operatorJustPressed = false
}

// Handle operator button click
const handleOperatorClick = (event) => {
    if (operator !== event.target.name) {
        // Save first operand along with operator
        n1 = input.innerText
        operator = event.target.name
        n2 = ""
    }

    operatorJustPressed = true
    equalsJustPressed = false
}

// Handle equals button click
const handleEqualsClick = (event) => {
    equalsJustPressed = true
    n2 = input.innerText // Grab second operand, first was saved when operator was clicked
    let result = input.innerText // If no operator was selected then number equals itself

    // Helper function to deal with floating-point precision. Rounds the number to the precision specified,
    // parseFloat trims unnecessary decimal places (.000...) to return a whole number if that be the case
    const fixFloat = (num, precision = 10) => {
        return parseFloat(num.toFixed(precision))
    }

    // Logic for each operator
    if (operator && n1 !== "" && n2 !== "") {
        const num1 = Number(n1)
        const num2 = Number(n2)

        switch (operator) {
            case "plus":
                result = fixFloat(num1 + num2).toString()
                break
            case "minus":
                result = fixFloat(num1 - num2).toString()
                break
            case "multiply":
                result = fixFloat(num1 * num2).toString()
                break
            case "divide":
                result = num2 === 0 ? "ERROR" : fixFloat(num1 / num2).toString() // Can't divide by zero
                break
            default:
                result = "ERROR"
        }
    }

    // Make sure result isn't longer than screen
    if (result === "ERROR") {
        input.innerText = result
        setTimeout(() => input.innerText = 0, 900)
    } else if (result.length > 14) {
        input.innerText = Number(result).toExponential(5)
    } else {
        input.innerText = result
    }

    // Result is new first operand
    n1 = result

    // Reset everything else
    n2 = ""
    operator = ""
    operatorJustPressed = false
}

// Select and add click event listeners for all number buttons
document.querySelectorAll("#number-buttons button").forEach(button => {
    button.addEventListener("click", handleNumberClick)
})

// Select and add click event listeners for all operator buttons (plus, minus, multiply, divide)
document.querySelectorAll(".operator").forEach(button => {
    button.addEventListener("click", handleOperatorClick)
})

// Select and add click event listeners for the rest of the buttons
document.querySelector("#point").addEventListener("click", handlePointClick) // Point/decimal
document.querySelector("#sign").addEventListener("click", handleSignClick) // Sign
document.querySelector("#clear").addEventListener("click", handleClearClick) // Clear
document.querySelector("#equals").addEventListener("click", handleEqualsClick) // Equals


// Keyboard navigability stuff
const handleKeyPress = (event) => {
    const key = event.key
    console.log(`${key} key pressed!`)

    if (!isNaN(key)) {
        document.querySelector(`button[value="${key}"]`).click()
    } else if (key === "Escape" || key === "c" || key === "C") {
        document.querySelector("#clear").click()
    } else if (key === "=" || key === "Enter") {
        document.querySelector("#equals").click()
    } else if (key === "+" || key === "p" || key === "P") {
        document.querySelector("#plus").click()
    } else if (key === "-") {
        document.querySelector("#minus").click()
    } else if (key === "*" || key === "x" || key === "X") {
        document.querySelector("#multiply").click()
    } else if (key === "/") {
        document.querySelector("#divide").click()
    } else if (key === ".") {
        document.querySelector("#point").click()
    } else if (key === "s" || key === "S") {
        document.querySelector("#sign").click()
    }
}

document.addEventListener("keydown", handleKeyPress)