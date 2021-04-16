//专门写sql语句

// 查询所有
const QUERY_TABLE = tableName => `SELECT * FROM ${tableName}`;

//查询指定column
const FIND_TABLE = (tableName, { primaryKey, primaryVal }) =>
    `SELECT * FROM ${tableName} WHERE(${primaryKey}='${primaryVal}')`;

// 插入数据,请使用query的第二个参数传参，？防止SQL注入 会在执行时把第二个参数传进sql语句 替换问号
// const INSERT_TABLE = (tableName, {key, val}) => `INSERT INTO ${tableName}(${key}) VALUES (${val})`
const INSERT_TABLE = tableName => `INSERT INTO ${tableName} SET ?`;

// 更新数据
const UPDATE_TABLE = (tableName, { primaryKey, primaryVal }, { key, val }) => {
    let res = `UPDATE ${tableName} SET `;
    key.map((v, i) => {
        if (i !== 0) {
            res += `,${v}='${val[i]}'`;
        } else {
            res += `${v}='${val[i]}'`;
        }
    });
    res = res + ` WHERE(${primaryKey}=${primaryVal});`;
    return res;
};

// 删除数据
const DELETE_TABLE = (tableName, { primaryKey, primaryVal }) =>
    `DELETE FROM ${tableName} WHERE(${primaryKey}=${primaryVal});`;

module.exports = {
    QUERY_TABLE,
    INSERT_TABLE,
    UPDATE_TABLE,
    DELETE_TABLE,
    FIND_TABLE,
};

//查询 文章-中间表-标签 语句
// let sql = `select DISTINCT(a.article_id), a.*, b.label_id,c.label_name from article a left join article_label b on a.article_id=b.article_id left join label c on b.label_id=c.label_id where article_status=1${
//     label_id ? ' and b.label_id=' + label_id : ''
// }${
//     keyword
//         ? " and ( article_content like '%" +
//           keyword +
//           "%' or article_title like '%" +
//           keyword +
//           "%' )"
//         : ''
// } limit ${pageNum * 10},${pageSize}`;
