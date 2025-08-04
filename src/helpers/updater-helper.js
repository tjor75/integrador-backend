export function createUpdateSql(table, replacementColumns, neededConditions) {
    const replacementColumnsLength = replacementColumns.length;
    const neededConditionsLength = neededConditions.length;
    let updateSql = "UPDATE " + table + " SET ";
    let i = 1;
    
    for (let j = 0; j < replacementColumnsLength; j++) {
        const column = replacementColumns[j];
        updateSql += `${column} = $${i}`;

        if (j < replacementColumnsLength - 1)
            updateSql += ", ";
        i++;
    }

    updateSql += " WHERE ";
    
    for (let k = 0; k < neededConditionsLength; k++) {
        const condition = neededConditions[k];
        updateSql += `${condition} = $${i}`;

        if (k < neededConditionsLength - 1)
            updateSql += " AND ";
        i++;
    }

    updateSql += ";";

    return updateSql;
}