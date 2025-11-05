import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
export default function Modal({ open, title, onClose, children }) {
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-[999]", children: [_jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-100 transition-opacity", onClick: onClose }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transform transition-all duration-200 scale-100 opacity-100", children: [_jsxs("div", { className: "border-b px-4 py-3 flex items-center justify-between", children: [_jsx("div", { className: "font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "h-8 w-8 grid place-items-center rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800", "aria-label": "Fechar", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "px-4 py-4", children: children })] }) })] }));
}
