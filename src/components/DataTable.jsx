import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  pageSize = 6,
  renderActions,
  title,
  subtitle
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Filter data based on searchKeys
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter((item) => {
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const val = item[key];
          return val && String(val).toLowerCase().includes(lower);
        });
      }
      return Object.values(item).some(val =>
        val && String(val).toLowerCase().includes(lower)
      );
    });
  }, [data, searchQuery, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB ? valB.toLowerCase() : '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="data-table-container">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div>
          {title && <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="table-search-box">
            <Search size={15} color="var(--color-text-secondary)" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter table data"
            />
          </div>
          {renderActions && renderActions()}
        </div>
      </div>

      {/* Table Viewport */}
      <div className="table-responsive-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown size={12} color={sortKey === col.key ? 'var(--color-primary)' : '#94A3B8'} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map((col) => (
                    <td key={col.key || col.header}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '36px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94A3B8' }}>
                    <Inbox size={32} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>No matching records found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderTop: '1px solid var(--color-border)',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          backgroundColor: '#FAFAFA'
        }}>
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ padding: '0 8px', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
