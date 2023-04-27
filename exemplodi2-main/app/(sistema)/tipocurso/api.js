import "server-only";

const route = process.env.API_URL + "tipocurso/";

async function getAllErrors(error) {
    let message = '';

    if (error.errors === undefined || error.erros === null)
        message = error;
    else {
        const totalErros = Object.keys(error.errors).length;

        for (var i = 0; i < totalErros; i++)
            message = message + Object.values(error.errors)[i] + "<br/>";
    }

    return message;
}

export async function handleRequest(param) {
    "use server"

    switch (param.method) {
        case 'get':
            return get(param.args);
            break;
        case 'post':
            return post(param.args);
            break;
        case 'put':
            return put(param.args);
            break;
        case 'delete':
            return Delete(param.args);
            break;
    }
}

async function get(obj) {

    let url = route;

    if (obj !== undefined && obj.id !== undefined)
        url = url + obj.id;

    const res = await fetch(url, { cache: 'no-store', headers:{'Authorization': 'bearer ' +  obj.token} });

    if (res.status === 200) {
        const data = await res.json();
        return { success: true, data: data };
    }
    else {
        const error = await res.text();
        return { success: false, data: error };
    }
}

async function post(obj) {

    var args = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' +  obj.token
        },
        body: JSON.stringify(obj),
        cache: 'no-store'
    };

    const res = await fetch(route, args);

    if (res.status === 200) {
        const data = await res.json();
        return { success: true, data: data };
    }
    else {
        let errorMessage = await getAllErrors(await res.json());
        return { success: false, data: errorMessage };
    }
}

async function put(obj) {
    var args = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
            'x-api-key': process.env.API_KEY,
            'x-client-name': process.env.API_CLIENT,
            'Authorization': 'bearer ' +  obj.token
        },
        body: JSON.stringify(obj),
        cache: 'no-store'
    };

    const res = await fetch(route + obj.id, args);

    if (res.status === 200) {
        const data = await res.json();
        return { success: true, data: data };
    }
    else {
        let errorMessage = await getAllErrors(await res.json());
        return { success: false, data: errorMessage };
    }
}

async function Delete(obj) {
    var args = {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
            'x-api-key': process.env.API_KEY,
            'x-client-name': process.env.API_CLIENT,
            'Authorization': 'bearer ' +  obj.token
        }
    };

    const res = await fetch(route + obj.id, args);

    if (res.status === 200) {
        const data = await res.text();
        return { success: true, data: data };
    }
    else {
        const error = await res.text();
        return { success: false, data: error };
    }
}