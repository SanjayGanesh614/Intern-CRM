export function parsePagination(q) {
    const page = Math.max(1, Number(q.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(q.pageSize || 20)));
    const skip = (page - 1) * pageSize;
    return { page, pageSize, skip };
}
export function parseSort(q) {
    const sortBy = String(q.sortBy || 'fetched_at');
    const sortDir = String(q.sortDir || 'desc').toLowerCase() === 'desc' ? -1 : 1;
    return { sortSpec: [[sortBy, sortDir]] };
}
