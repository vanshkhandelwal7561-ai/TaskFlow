export default function Button({ children, variant = 'primary', loading, className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="spinner-sm" /> : children}
    </button>
  );
}
