// 智能计算器主要JavaScript文件
// 包含通用功能和工具函数

class CalculatorUtils {
    // 数学常数
    static CONSTANTS = {
        PI: Math.PI,
        E: Math.E,
        PHI: (1 + Math.sqrt(5)) / 2,
        SQRT2: Math.sqrt(2),
        LN2: Math.LN2,
        LN10: Math.LN10
    };

    // 角度转换
    static toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static toDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    // 格式化数字
    static formatNumber(num, precision = 6) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // 处理非常大或非常小的数字
        if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(precision);
        }
        
        // 常规数字格式化
        return parseFloat(num.toFixed(precision)).toString();
    }

    // 验证表达式
    static validateExpression(expr) {
        try {
            // 检查括号匹配
            const openBrackets = (expr.match(/\(/g) || []).length;
            const closeBrackets = (expr.match(/\)/g) || []).length;
            if (openBrackets !== closeBrackets) {
                return { valid: false, error: '括号不匹配' };
            }

            // 检查连续运算符
            if (/[+\-*/^]{2,}/.test(expr)) {
                return { valid: false, error: '运算符错误' };
            }

            // 检查空括号
            if (/\(\)/.test(expr)) {
                return { valid: false, error: '空括号' };
            }

            return { valid: true };
        } catch (error) {
            return { valid: false, error: '表达式格式错误' };
        }
    }

    // 安全计算
    static safeCalculate(expr) {
        try {
            // 验证表达式
            const validation = this.validateExpression(expr);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // 替换数学函数
            let safeExpr = expr;
            safeExpr = safeExpr.replace(/Math\./g, ''); // 移除Math.前缀
            
            // 使用Function构造函数进行安全计算
            const result = new Function('return ' + safeExpr)();
            
            if (!isFinite(result)) {
                throw new Error('计算结果无效');
            }
            
            return result;
        } catch (error) {
            throw new Error('计算错误: ' + error.message);
        }
    }

    // 单位转换工具
    static convertUnit(value, fromUnit, toUnit) {
        const units = {
            // 长度单位 (基准: 米)
            length: {
                m: 1,
                cm: 100,
                mm: 1000,
                km: 0.001,
                in: 39.3701,
                ft: 3.28084,
                yd: 1.09361,
                mile: 0.000621371
            },
            // 重量单位 (基准: 千克)
            weight: {
                kg: 1,
                g: 1000,
                mg: 1000000,
                lb: 2.20462,
                oz: 35.274,
                ton: 0.001
            },
            // 温度单位
            temperature: {
                celsius: { toKelvin: (c) => c + 273.15, fromKelvin: (k) => k - 273.15 },
                fahrenheit: { toKelvin: (f) => (f - 32) * 5/9 + 273.15, fromKelvin: (k) => (k - 273.15) * 9/5 + 32 },
                kelvin: { toKelvin: (k) => k, fromKelvin: (k) => k }
            }
        };

        // 简单单位转换
        if (units.length[fromUnit] && units.length[toUnit]) {
            const meters = value / units.length[fromUnit];
            return meters * units.length[toUnit];
        }

        if (units.weight[fromUnit] && units.weight[toUnit]) {
            const kilograms = value / units.weight[fromUnit];
            return kilograms * units.weight[toUnit];
        }

        throw new Error('不支持该单位转换');
    }

    // 颜色主题工具
    static getThemeColors(theme = 'dark') {
        const themes = {
            dark: {
                background: '#1a1a2e',
                secondary: '#16213e',
                accent: '#2196f3',
                success: '#4caf50',
                warning: '#ff9800',
                error: '#f44336',
                text: '#ffffff',
                textSecondary: '#b0b0b0'
            },
            light: {
                background: '#f5f5f5',
                secondary: '#ffffff',
                accent: '#2196f3',
                success: '#4caf50',
                warning: '#ff9800',
                error: '#f44336',
                text: '#333333',
                textSecondary: '#666666'
            }
        };

        return themes[theme] || themes.dark;
    }
}

// 动画工具类
class AnimationUtils {
    // 按钮点击动画
    static buttonClick(button, duration = 150) {
        if (!button) return;
        
        anime({
            targets: button,
            scale: [1, 0.95, 1],
            duration: duration,
            easing: 'easeOutQuad'
        });
    }

    // 结果显示动画
    static showResult(element, duration = 500) {
        if (!element) return;
        
        anime({
            targets: element,
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutElastic(1, .8)'
        });
    }

    // 页面加载动画
    static pageLoad(elements, stagger = 50) {
        if (!elements) return;
        
        anime({
            targets: elements,
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(stagger),
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    // 淡入动画
    static fadeIn(element, duration = 300) {
        if (!element) return;
        
        anime({
            targets: element,
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutQuad'
        });
    }

    // 滑入动画
    static slideIn(element, direction = 'left', duration = 400) {
        if (!element) return;
        
        const translateProp = direction === 'left' ? 'translateX' : 'translateY';
        const startValue = direction === 'left' ? -50 : -50;
        
        anime({
            targets: element,
            [translateProp]: [startValue, 0],
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutExpo'
        });
    }

    // 脉冲动画
    static pulse(element, scale = 1.1, duration = 600) {
        if (!element) return;
        
        anime({
            targets: element,
            scale: [1, scale, 1],
            duration: duration,
            easing: 'easeInOutQuad'
        });
    }

    // 颜色变化动画
    static colorChange(element, colors, duration = 800) {
        if (!element || !colors) return;
        
        anime({
            targets: element,
            backgroundColor: colors,
            duration: duration,
            easing: 'easeInOutQuad'
        });
    }
}

// 存储工具类
class StorageUtils {
    // 保存到localStorage
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存失败:', error);
            return false;
        }
    }

    // 从localStorage读取
    static load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('读取失败:', error);
            return defaultValue;
        }
    }

    // 删除存储项
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('删除失败:', error);
            return false;
        }
    }

    // 清空所有存储
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清空失败:', error);
            return false;
        }
    }

    // 获取存储大小
    static getSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
}

// 键盘事件管理器
class KeyboardManager {
    constructor() {
        this.listeners = new Map();
        this.isActive = false;
    }

    // 启动键盘监听
    start() {
        if (this.isActive) return;
        
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.isActive = true;
    }

    // 停止键盘监听
    stop() {
        if (!this.isActive) return;
        
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        this.isActive = false;
    }

    // 添加键盘监听器
    addListener(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }

    // 移除键盘监听器
    removeListener(key, callback) {
        if (this.listeners.has(key)) {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    // 处理键盘事件
    handleKeyDown(event) {
        const key = event.key;
        
        // 获取对应按键的监听器
        const callbacks = this.listeners.get(key) || [];
        
        // 执行回调函数
        callbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('键盘回调执行失败:', error);
            }
        });
    }
}

// 错误处理工具
class ErrorHandler {
    static showError(message, duration = 3000) {
        // 创建错误提示元素
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
            </div>
        `;
        
        // 添加样式
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(244, 67, 54, 0.4);
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(errorDiv);
        
        // 动画显示
        anime({
            targets: errorDiv,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
        
        // 自动移除
        setTimeout(() => {
            anime({
                targets: errorDiv,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInExpo',
                complete: () => {
                    document.body.removeChild(errorDiv);
                }
            });
        }, duration);
    }

    static showSuccess(message, duration = 2000) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-message">${message}</span>
            </div>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(successDiv);
        
        anime({
            targets: successDiv,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
        
        setTimeout(() => {
            anime({
                targets: successDiv,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInExpo',
                complete: () => {
                    document.body.removeChild(successDiv);
                }
            });
        }, duration);
    }
}

// 全局实例
const keyboardManager = new KeyboardManager();
const calculatorUtils = CalculatorUtils;
const animationUtils = AnimationUtils;
const storageUtils = StorageUtils;
const errorHandler = ErrorHandler;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 启动键盘管理器
    keyboardManager.start();
    
    // 设置全局错误处理
    window.addEventListener('error', function(event) {
        console.error('全局错误:', event.error);
        errorHandler.showError('发生了一个错误，请刷新页面重试');
    });
    
    // 设置未处理的Promise拒绝
    window.addEventListener('unhandledrejection', function(event) {
        console.error('未处理的Promise拒绝:', event.reason);
        errorHandler.showError('操作失败，请重试');
    });
});

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CalculatorUtils,
        AnimationUtils,
        StorageUtils,
        KeyboardManager,
        ErrorHandler
    };
}