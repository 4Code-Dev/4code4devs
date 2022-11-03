const axios = require('axios')
const cheerio = require('cheerio')

const url = process.env.FOURDEVS_URL || 'https://www.4devs.com.br/ferramentas_online.php'
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');


const request = (method, req, res) => {
    console.log(method)
    const body = req.query

    if (method != null)
        body['acao'] = method
    if (req.query.acao == 'undefined')
        res.json({ erro: 'paramentro acao é um campo obrigatorio :)' })

    return axios.post(url, toUrlEncoded(body), config)
}

const gerador = async (method, req, res) => {
    const result = await request(method, req, res)
    const content_type = result.headers['content-type']
    try {
        let json
        if (content_type.includes('json'))
            json = await json2json(result)
        else if (content_type.includes('html'))
            json = await html2json(result)
        else
            res.json({ erro: 'Não sei como fazer aqui não content type ' + content_type })

        res.json(json)
    } catch (err) {
        res.send(err)
    }
}

// Caso a complexidado do metodo almente esta preparado com promise
const json2json = async result => {
    return new Promise((resolve, reject) => {
        resolve(result.data)
    })
}

const html2json = async result => {
    return new Promise((resolve, reject) => {
        try {
            const $ = cheerio.load(result.data)
            const json = {}
            $('[id]').each((i, el) => {
                const $el = $(el)
                json[$el.attr('id')] = getValue($el)
            })
            resolve(json)
        } catch (error) {
            reject(error)
        }
    })
}

const getValue = (el) => {
    switch (el[0].name) {
        case "div":
            return el.text()
        case "input":
            return el.val()
    }
}

module.exports = {
    gerador: {
        pessoa: async (req, res) => await gerador('gerar_pessoa', 'pessoa', req, res),
        empresa: async (req, res) => await gerador('gerar_empresa', 'empresa', req, res),
        cartao_credito: async (req, res) => await gerador('gerar_cc', 'cc', req, res),
        veiculo: async (req, res) => await gerador('gerar_veiculo', 'veiculo', req, res),
        conta_bancaria: async (req, res) => await gerador('gerar_conta_bancaria', 'conta_bancaria', req, res),
        renavam: async (req, res) => await gerador('gerar_renavam', 'renavam', req, res),
        cpf: async (req, res) => await gerador('gerar_cpf', 'cpf', req, res),
        cnpj: async (req, res) => await gerador('gerar_cnpj', 'cnpj', req, res),
        rg: async (req, res) => await gerador('gerar_rg', 'rg', req, res),
        ie: async (req, res) => await gerador('gerar_ie', 'ie', req, res),
        cnh: async (req, res) => await gerador('gerar_cnh', 'cnh', req, res)
    }
}