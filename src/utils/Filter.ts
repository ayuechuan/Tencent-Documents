export class FilterRule {
  column: any
  operator: any
  value: any
  constructor(column: any, operator: any, value: any) {
    this.column = column;
    this.operator = operator;
    this.value = value;
  }

  matches(row: any) {
    const cellValue = row[this.column];
    switch (this.operator) {
      case '=':
        return cellValue === this.value;
      case '!=':
        return cellValue !== this.value;
      case '>':
        return cellValue > this.value;
      case '<':
        return cellValue < this.value;
      case 'contains':
        return typeof cellValue === 'string' && cellValue.includes(this.value);
      default:
        return false;
    }
  }
}

class FilterGroup {
  type: any
  rules: any
  constructor(type = 'AND') {
    this.type = type.toUpperCase(); // 'AND' 或 'OR'
    this.rules = [];
  }

  addRule(rule: any) {
    this.rules.push(rule);
  }

  matches(row: any) {
    if (this.type === 'AND') {
      return this.rules.every((rule: any) => rule.matches(row));
    } else if (this.type === 'OR') {
      return this.rules.some((rule: any) => rule.matches(row));
    }
    return false;
  }
}

class TableFilter {
  data: any;
  filterGroups: any
  constructor(data: any) {
    this.data = data;
    this.filterGroups = [];
  }

  addFilterGroup(filterGroup: any) {
    this.filterGroups.push(filterGroup);
  }

  applyFilters() {
    console.log('this.filterGroups',this.filterGroups);
    
    return this.data.filter((row: any) =>
    {
      console.log('row----',row);
      
      return this.filterGroups.every((group: any) => group.matches(row))
    }
    );
  }
}

const data = [
  { name: 'Alice', age: 25, role: 'Engineer' },
  { name: 'Bob', age: 30, role: 'Designer' },
  { name: 'Carol', age: 35, role: 'Engineer' },
];

// 创建条件组1：年龄大于 28 且 角色为 Engineer
const group1 = new FilterGroup('AND');
group1.addRule(new FilterRule('age', '>', 28));
group1.addRule(new FilterRule('role', '=', 'Engineer'));

// 创建条件组2：名字包含 'A'（注意这是 OR）
const group2 = new FilterGroup('OR');
group2.addRule(new FilterRule('name', 'contains', 'a'));
group2.addRule(new FilterRule('name', 'contains', 'A'));

const tableFilter = new TableFilter(data);
// tableFilter.addFilterGroup(group1);
tableFilter.addFilterGroup(group2);

const filteredData = tableFilter.applyFilters();
console.error("筛选条件------",filteredData);

