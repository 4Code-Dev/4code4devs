const { gerar, validar } = require('./controllers/as-lib');
const { writeFileSync } = require('fs');
const {resolve } = require('path');
const { item: [{ item: gerarReqList }, { item: validarReqList }] } = require('../doc/Dev tools.postman_collection.json');

const buildComment = (data, funcName) => `/** ${data} */
${funcName}: ${gerar[funcName]},
`;

const buildCommentValidar = (data, funcName) => `/** ${data} */
${funcName}: ${validar[funcName]},
`;


const buildFromRequest = ({ name, description = '', funcName, funcParams = [] }) => {
    const params = funcParams?.map(({ key, value = 'Sem Valor' }, index, { length }) => `* @param {String} req.query.${key} - '${value}'${index < (length - 1) ? ',' : ''}`)?.join(`\n`);
    const withDash = description ? ` - ${description}` : '';
    return (
        `${name}${withDash}
* @function ${funcName}
* ${params ? `
* @param {Object} req - object representing a request
* @param {Object} req.query - query of request
${params}` : ''}`);
}


const buildValidatorFromRequest = ({ name, description = '', funcName, funcParams = [], pathParam }) => {
    const params = funcParams?.map(({ key, value = 'Sem Valor' }, index, { length }) => `* @param {String} req.query.${key} - '${value}'${index < (length - 1) ? ',' : ''}`)?.join(`\n`);
    const withDash = description ? ` - ${description}` : '';
    return (
        `${name}${withDash}
* @function ${funcName}
* ${params ? `
* @param {Object} req - object representing a request
* @param {Object} req.query - query of request
${params}` : ''}`);
}


const generateDocsFromGerar = () => {
    const finalContent = gerarReqList.map(({ name, request: { description, url: { path: [, funcName], query: funcParams } } }) => {
        const current = buildFromRequest({ name, description, funcName, funcParams })
        return buildComment(current, funcName);
    }).join('');

    const templateFile = ` 
    module.exports = {
    ${finalContent}
    }
    `;
    
    writeF('gerar.txt', templateFile);
};


const generateDocsFromValidar = () => {
    const finalContent = validarReqList.map(({ name, request: { description, url: { path: [, funcName, pathParam], query: funcParams } } }) => {
        const current = buildValidatorFromRequest({ name, description, funcName, funcParams, pathParam })
        return buildCommentValidar(current, funcName);
    }).join('');
    const templateFile = `
    module.exports = {
    ${finalContent}
    }
    `;

    writeF('validar.txt', templateFile);
};

const bodyExecution = {
    gerar: generateDocsFromGerar,
    validar: generateDocsFromValidar
};



const writeF = (fileName, content) => {
    function formatDate(date) {
        return date.toISOString().replace(/\D*/g, '').substring(0, 17);
    }
    const fname = resolve(`./${formatDate(new Date())}-${fileName}`);
    writeFileSync(fname, content, {
        encoding: 'utf-8',
        flag:'w+'
    });
    
};

// bodyExecution.validar();
(async () => console.log({ pessoa: await validar.cpf({ params: { cpf: '02623805115' } }) }))();
