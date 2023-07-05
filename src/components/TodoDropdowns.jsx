import React from "react";

const TodoDropdowns = ({
  filter,
  handleFilterChange,
  sort,
  handleSortChange,
  direction,
  handleDirectionChange,
}) => {
  return (
    <div className="TodoDropdowns">
      <div>
        <label htmlFor="filter">Filter: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">Show all tasks</option>
          <option value="completed">Filter by completed</option>
          <option value="uncompleted">Filter by uncompleted</option>
        </select>
      </div>
      <div>
        <label htmlFor="sort">Sort: </label>
        <select id="sort" value={sort} onChange={handleSortChange}>
          <option value="id">Sort by task ID</option>
          <option value="status">Sort by task status</option>
          <option value="date">Sort by Date</option>
          <option value="description">Sort by description</option>
        </select>
      </div>
      <div>
        <label htmlFor="direction">Direction: </label>
        <select
          id="direction"
          value={direction}
          onChange={handleDirectionChange}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
    </div>
  );
};

export default TodoDropdowns;
