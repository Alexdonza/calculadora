class Calculator {
    constructor() {
        this.currentNumber = '';
        this.previousNumber = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.shouldResetDisplay = false;
        this.lastResult = null;
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.addEventListeners();
    }
    
    addEventListeners() {
        // Números
        document.querySelectorAll('.number').forEach(btn => {
            btn.addEventListener('click', () => {
                const number = btn.dataset.number;
                this.inputNumber(number);
            });
        });
        
        // Operadores
        document.querySelectorAll('.operator').forEach(btn => {
            btn.addEventListener('click', () => {
                const operator = btn.dataset.operator;
                this.inputOperator(operator);
            });
        });
        
        // Igual
        document.getElementById('equals').addEventListener('click', () => {
            this.calculate();
        });
        
        // AC (Clear All)
        document.querySelector('[data-action="clear"]').addEventListener('click', () => {
            this.clearAll();
        });
        
        // Porcentaje
        document.querySelector('[data-action="percent"]').addEventListener('click', () => {
            this.percentage();
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    inputNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentNumber = '';
            this.shouldResetDisplay = false;
        }
        
        if (num === '.') {
            if (this.currentNumber.includes('.')) return;
            if (this.currentNumber === '') {
                this.currentNumber = '0';
            }
        }
        
        this.currentNumber += num;
        this.updateDisplay();
        this.waitingForOperand = false;
    }
    
    inputOperator(operator) {
        const currentValue = parseFloat(this.currentNumber);
        
        if (this.waitingForOperand && this.operator) {
            this.operator = operator;
            this.updateDisplay();
            return;
        }
        
        if (this.previousNumber !== '' && !this.waitingForOperand) {
            this.calculate();
        }
        
        this.operator = operator;
        this.previousNumber = this.currentNumber;
        this.waitingForOperand = true;
        this.updateDisplay();
    }
    
    calculate() {
        if (this.operator === null || this.waitingForOperand) return;
        
        const prev = parseFloat(this.previousNumber);
        const current = parseFloat(this.currentNumber);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result = 0;
        
        switch(this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Error: No se puede dividir por cero');
                    this.clearAll();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Redondear a 10 decimales para evitar errores de precisión
        result = Math.round(result * 10000000000) / 10000000000;
        
        this.currentNumber = result.toString();
        this.lastResult = result;
        this.operator = null;
        this.previousNumber = '';
        this.waitingForOperand = true;
        this.shouldResetDisplay = true;
        
        this.updateDisplay(true);
    }
    
    percentage() {
        if (this.currentNumber === '') return;
        
        let value = parseFloat(this.currentNumber);
        value = value / 100;
        this.currentNumber = value.toString();
        this.updateDisplay();
        
        if (!this.waitingForOperand && this.operator) {
            this.waitingForOperand = false;
        }
    }
    
    clearAll() {
        this.currentNumber = '';
        this.previousNumber = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.shouldResetDisplay = false;
        this.lastResult = null;
        this.updateDisplay();
    }
    
    formatNumber(number) {
        if (number === '') return '0';
        
        // Convertir a número y formatear
        let num = parseFloat(number);
        if (isNaN(num)) return '0';
        
        // Para números muy grandes o pequeños, usar notación científica
        if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-8 && num !== 0)) {
            return num.toExponential(8);
        }
        
        // Formatear con separadores de miles
        let [integer, decimal] = num.toString().split('.');
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        if (decimal) {
            // Limitar decimales a 8
            decimal = decimal.slice(0, 8);
            return `${integer}.${decimal}`;
        }
        
        return integer;
    }
    
    updateDisplay(isResult = false) {
        const calculationElement = document.getElementById('calculation');
        const resultElement = document.getElementById('result');
        
        // Mostrar la operación completa
        if (this.operator && this.previousNumber && !isResult) {
            calculationElement.textContent = `${this.formatNumber(this.previousNumber)} ${this.operator} ${this.currentNumber || '0'}`;
        } else if (this.operator && this.previousNumber && this.waitingForOperand) {
            calculationElement.textContent = `${this.formatNumber(this.previousNumber)} ${this.operator}`;
        } else {
            calculationElement.textContent = this.currentNumber ? this.formatNumber(this.currentNumber) : '0';
        }
        
        // Mostrar resultado
        if (this.currentNumber === '' && !this.operator) {
            resultElement.textContent = '0';
        } else if (this.waitingForOperand && this.operator && !isResult) {
            resultElement.textContent = this.formatNumber(this.previousNumber);
        } else {
            resultElement.textContent = this.formatNumber(this.currentNumber);
        }
    }
    
    handleKeyboard(e) {
        const key = e.key;
        
        // Números y punto
        if (/[0-9]/.test(key)) {
            e.preventDefault();
            this.inputNumber(key);
        } else if (key === '.') {
            e.preventDefault();
            this.inputNumber('.');
        }
        // Operadores
        else if (key === '+') {
            e.preventDefault();
            this.inputOperator('+');
        } else if (key === '-') {
            e.preventDefault();
            this.inputOperator('-');
        } else if (key === '*') {
            e.preventDefault();
            this.inputOperator('×');
        } else if (key === '/') {
            e.preventDefault();
            this.inputOperator('÷');
        }
        // Enter o = para calcular
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.calculate();
        }
        // Escape o Delete para limpiar
        else if (key === 'Escape' || key === 'Delete') {
            e.preventDefault();
            this.clearAll();
        }
        // % para porcentaje
        else if (key === '%') {
            e.preventDefault();
            this.percentage();
        }
        // Backspace para borrar último carácter
        else if (key === 'Backspace') {
            e.preventDefault();
            this.currentNumber = this.currentNumber.slice(0, -1);
            if (this.currentNumber === '') {
                this.currentNumber = '0';
            }
            this.updateDisplay();
        }
    }
}

// Inicializar la calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
