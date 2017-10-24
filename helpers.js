let extractFields = errMessage => {
    let re = /`([^`]*)`/g
    let fields = errMessage.match(re)
                .map( missingField => missingField.replace(/`/g, ""))
                .map(missingField => missingField.replace(/_/g, " "))
    return fields
}

module.exports = {extractFields}
