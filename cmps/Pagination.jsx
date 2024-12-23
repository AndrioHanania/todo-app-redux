export const Pagination = ({ pagination, totalPages, onChangePage, onChangePageSize }) => {
    const isPrevPageDisabled = pagination.page <= 1;
    const isNextPageDisabled = pagination.page >= totalPages;

    if(!pagination || !totalPages) return null;

        function PageNumbers() {
            const total = totalPages - pagination.page + 1;

            return (
                totalPages <= 3 ? (
                    [...Array(total)].map((_, index) => (
                        <li key={`page-number-${index + pagination.page}`} className="page-number">
                        <button
                            className={`${
                            pagination.page === index + pagination.page ? 'active' : ''
                            }`}
                            onClick={() => onChangePage(index + pagination.page)}
                        >
                            {index + pagination.page}
                        </button>
                        </li>
                    ))
                ) : (
                    [
                        [...Array(3)].map((_, index) => {
                            const page = index + 1 + 3 * Math.floor(index / 3);

                            return (
                            <li key={`page-number-${page}`} className="page-number">
                            <button
                                className={`${
                                pagination.page === page ? 'active' : ''
                                }`}
                                onClick={() => onChangePage(page)}
                            >
                                {page}
                            </button>
                            </li>
                        )}),
                        <li key="ellipsis" className="page-number ellipsis">
                            ...
                        </li>,
                        <li key={`page-number-${totalPages}`} className="page-number">
                            <button
                                className={`${
                                pagination.page === totalPages ? 'active' : ''
                                }`}
                                onClick={() => onChangePage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </li>
                    ]
                )
            )
        }

    return (
        <div className="pagination-container">
        <div className="pagination-panel">
            <button className={`${isPrevPageDisabled ? 'disabled' : ''}`} disabled={isPrevPageDisabled} onClick={() => onChangePage(pagination.page - 1)}>&larr;</button>
            
            <ul className="page-numbers">
                <PageNumbers total={totalPages - pagination.page + 1}/>
            </ul>

            <button className={`${isNextPageDisabled ? 'disabled' : ''}`} disabled={isNextPageDisabled} onClick={() => onChangePage(pagination.page +1)}>&rarr;</button>
        </div>
        <div className="pagination-controller">
            <span>Page: {pagination.page}</span>
            <ul className="page-sizes">
                {[5, 10, 15, 20].map((number, index) => (
                    <li key={`page-size-${index}`} className="page-size">
                        <button className={`${pagination.pageSize === number ? 'active' : ''}`} onClick={() => onChangePageSize(number)}>{number}</button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
};
