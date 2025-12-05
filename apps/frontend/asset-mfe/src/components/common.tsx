

/**
 * 페이지 레이아웃 컴포넌트
 * 모든 페이지에서 공통으로 사용하는 레이아웃
 */
interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageLayout({ title, description, children, actions }: PageLayoutProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
}

/**
 * 데이터 테이블 컴포넌트
 */
interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  loading = false,
  emptyText = '데이터가 없습니다.'
}: DataTableProps<T>) {
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (data.length === 0) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render 
                    ? column.render((record as any)[column.key], record)
                    : (record as any)[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 버튼 컴포넌트
 */
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button'
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

/**
 * 검색 폼 컴포넌트
 */
interface SearchFormProps {
  onSearch: (values: Record<string, any>) => void;
  children: React.ReactNode;
}

export function SearchForm({ onSearch, children }: SearchFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, any> = {};
    formData.forEach((value, key) => {
      values[key] = value;
    });
    onSearch(values);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      {children}
      <Button type="submit">검색</Button>
    </form>
  );
}

/**
 * 입력 필드 컴포넌트
 */
interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

export function InputField({ 
  name, 
  label, 
  type = 'text', 
  placeholder,
  required = false,
  defaultValue
}: InputFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
      />
    </div>
  );
}

/**
 * 선택 필드 컴포넌트
 */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  defaultValue?: string;
}

export function SelectField({ 
  name, 
  label, 
  options, 
  required = false,
  defaultValue
}: SelectFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
      >
        <option value="">선택하세요</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
