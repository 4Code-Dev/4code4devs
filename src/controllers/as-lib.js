

const axios = require('axios');

const url = process.env.FOURDEVS_URL || 'https://www.4devs.com.br/ferramentas_online.php'
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');


const requestGerador = (method, req) => {
    console.log(method)
    const body = req?.query ?? { query: { acao: 'gerar_pessoa' } }

    if (method != null)
        body['acao'] = method
    if (req.query.acao == 'undefined')
        throw new Error({ erro: 'paramentro acao é um campo obrigatorio :)' });

    return axios.post(url, toUrlEncoded(body), config)
}

const geradorNode = async (method, key, req) => {
    const result = await requestGerador(method, req)
    let json = {}
    json[key] = result.data
    return json;
}
const gerador = async (method, req) => {
    try {
        const { data } = await requestGerador(method, req);
        return data;
    } catch (err) {
        throw err;
    }
}



const requestValidador = (method, key, req) => {
    console.log(method)
    const body = req.query

    if (method != null)
        body['acao'] = method

    if (key !== null)
        body['txt_' + key] = req.params[key]

    if (req.query.acao == 'undefined')
        throw new Error({ erro: 'paramentro acao é um campo obrigatorio :)' })

    return axios.post(url, toUrlEncoded(body), config)
}

const validador = async (method, key, req) => {
    req.query = req.query ?? {};
    const result = await requestValidador(method, key, req)
    let json = {}

    json.valido = result.data.includes('Verdadeiro') ? true : false

    if (key !== null) {
        json.valor = req.params[key]
        json.chave = key
    }

    Object.assign(json, req.query)

    return json;
}


module.exports = {
    gerar: {
        /** Pessoa - Gera dados de um brasileiro
        * @function pessoa
        *  */
        pessoa: (req) => gerador('gerar_pessoa', req),
        /** Empresa - Gera dados de uma empresa
        * @function empresa
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S',
        * @param {String} req.query.estado - 'RO',
        * @param {String} req.query.idade - '5' */
        empresa: (req) => gerador('gerar_empresa', req),
        /** Cartão de crédito - Gerar dados de um cartão a partir da bandeira do mesmo
        
        * @function cartao_credito
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S',
        * @param {String} req.query.bandeira - 'master' */
        cartao_credito: (req) => gerador('gerar_cc', req),
        /** Veículo - Gera dados de um veiculo
        * @function veiculo
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S' */
        veiculo: (req) => gerador('gerar_veiculo', req),
        /** Conta bancaria
        * @function conta_bancaria
        *  */
        conta_bancaria: (req) => gerador('gerar_conta_bancaria', req),
        /** Renavam
        * @function renavam
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S' */
        renavam: (req) => geradorNode('gerar_renavam', 'renavam', req),
        /** Cpf
        * @function cpf
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S' */
        cpf: (req) => geradorNode('gerar_cpf', 'cpf', req),
        /** Cnpj
        * @function cnpj
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S' */
        cnpj: (req) => geradorNode('gerar_cnpj', 'cnpj', req),
        /** Inscrição estadual
        * @function ie
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.pontuacao - 'S',
        * @param {String} req.query.estado - 'RO' */
        ie: (req) => geradorNode('gerar_ie', 'ie', req)

    },
    validar: {
        /** Cartão de crédito - A query bandeira e um parametro obrigatorio e os valores
    suportados são
    
    - MasterCard
    - Visa
    - Visa Electron
    - American Express
    - Diners Club
    - Discover
    - Enroute
    - JCB
    - Maestro
    - Solo
    - Switch
    - LaserCard
    * @function cartao_credito
    * 
    * @param {Object} req - object representing a request
    * @param {Object} req.query - query of request
    * @param {String} req.query.bandeira - 'MasterCard' */
        cartao_credito: (req) => validador('validar_cc', 'cc', req),
        /** Conta bancaria - Na query `banco` use da seguinte forma
        
        - 2   - Banco do Brasil
        - 121 - Bradesco
        - 85  - Citibank
        - 120 - Itaú
        - 151 - Santander
        * @function conta_bancaria
        * 
        * @param {Object} req - object representing a request
        * @param {Object} req.query - query of request
        * @param {String} req.query.banco - '2',
        * @param {String} req.query.agencia - '11797',
        * @param {String} req.query.conta - '444332' */
        conta_bancaria: (req) => validador('validar_conta_bancaria', null, req),
        /** Certidao - Na query `banco` use da seguinte forma
        
        - 2   - Banco do Brasil
        - 121 - Bradesco
        - 85  - Citibank
        - 120 - Itaú
        - 151 - Santander
        * @function certidao
        *  */
        certidao: (req) => validador('validar_certidao', 'certidao', req),
        /** CNH - Na query `banco` use da seguinte forma
        
        - 2   - Banco do Brasil
        - 121 - Bradesco
        - 85  - Citibank
        - 120 - Itaú
        - 151 - Santander
        * @function cnh
        *  */
        cnh: (req) => validador('validar_cnh', 'cnh', req),
        /** Cnpj
        * @function cnpj
        *  */
        cnpj: (req) => validador('validar_cnpj', 'cnpj', req),
        /** Cpf
        * @function cpf
        *  */
        cpf: (req) => validador('validar_cpf', 'cpf', req),
        /** PIS/PASEP
        * @function pis
        *  */
        pis: (req) => validador('validar_pis', 'pis', req),
        /** Renavam
        * @function renavam
        *  */
        renavam: (req) => validador('validar_renavam', 'renavam', req),
        /** RG
        * @function rg
        *  */
        rg: (req) => validador('validar_rg', 'rg', req),
        /** Titulo eleitor
        * @function titulo_eleitor
        *  */
        titulo_eleitor: (req) => validador('validar_titulo_eleitor', 'titulo_eleitor', req),

    }
}