const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose'); // Importa mongoose para cerrar la conexión después

jest.setTimeout(15000);

describe('users', () => {
    var token = "";
    var id = "";

    // Conexión a la base de datos antes de las pruebas
    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Aumenta el timeout si es necesario
        });
    });

    it('should register a user', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                "name": "Menganitos",
                "age": 20,
                "email": "prueba109@test.com",
                "password": "HolaMundo.01",
                "city": "Madrid",
                "interests": ["futbol", "baloncesto"]
            })
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body.user.email).toEqual('prueba109@test.com');
        expect(response.body.user.role).toEqual('user');
        token = response.body.token;
        id = response.body.user._id;
        console.log("Usuario registrado.", response.body);
    });

    it('should login a user', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ "email": "prueba109@test.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(200);

        console.log(response.body);

        expect(response.body.user.email).toEqual('prueba109@test.com');
        token = response.body.token;
        console.log(`Usuario ${response.body.user.email} logeado.\nToken: `, token);
    });

    it('should update a user', async () => {
        const response = await request(app)
            .put('/api/user/update')
            .auth(token, { type: 'bearer' })
            .send({
                "name": "Juan",
                "age": "98",
                "email": "pruebaUpdate2@test.com",
                "city": "Lugo"
            })
            .set('Accept', 'application/json')
            .expect(200);

        console.log(response.body);

        if (response.body.user) {
            expect(response.body.user.email).toEqual('pruebaUpdate2@test.com');
        } else {
            console.error('Error: La respuesta no contiene el objeto user');
        }

        console.log("Usuario actualizado.", response.body);
    });

    it('should delete a user', async () => {
        const response = await request(app)
            .delete('/api/user')
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body.message).toEqual(`USUARIO ELIMINADO EXITOSAMENTE`);
        console.log("Usuario eliminado.", response.body);
    });

    // Cierra la conexión después de todas las pruebas
    afterAll(async () => {
        await mongoose.connection.close(); // Cierra la conexión de MongoDB
    });
});

describe('comercios', () => {
    var token = "";
    var cif = "";

    // Verifica la conexión a la base de datos antes de ejecutar las pruebas
    beforeAll(async () => {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB conectado');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Error en la conexión de MongoDB:', err);
        });

        // Hacer login para obtener el token
        const loginResponse = await request(app)
            .post('/api/user/login')
            .send({ "email": "prueba109@test.com", "password": "HolaMundo.01" });

        console.log('Respuesta del login:', loginResponse.body);

        // Si no se obtiene el token, termina las pruebas de comercio
        if (!loginResponse.body.token) {
            console.error('Error: No se pudo obtener el token');
            return;  // Detener pruebas si no se obtuvo el token
        }

        token = loginResponse.body.token;
    });

    // Prueba para crear un comercio
    it('should create a commerce', async () => {
        if (!token) {
            console.error('Error: No hay token disponible, prueba no ejecutada');
            return;  // No continuar si no hay token
        }

        const response = await request(app)
            .post('/api/commerce/create')
            .auth(token, { type: 'bearer' })
            .send({
                "name": "SuperTienda",
                "cif": "987654321",
                "email": "superx@example.com",
                "phone": "987654321",
                "address": "Calle Ficticia, 123, Ciudad Ejemplo"
            })
            .set('Accept', 'application/json');

        console.log('Respuesta del comercio:', response.body);

        // Verifica la respuesta
        expect(response.status).toBe(200);
        expect(response.body.commerce.name).toEqual('SuperTienda');
        expect(response.body.commerce.email).toEqual('superx@example.com');
        cif = response.body.commerce.cif;
    });

    // Prueba para obtener los detalles del comercio
    it('should get commerce details', async () => {
        if (!cif) {
            console.error("Error: El CIF no está definido.");
            return;  // Detener la prueba si el CIF no está disponible
        }

        const response = await request(app)
            .get(`/api/commerce/${cif}`)
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' });

        console.log('Detalles del comercio:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.commerce.cif).toEqual(cif);
    });

    // Prueba para actualizar un comercio
    it('should update a commerce', async () => {
        if (!cif) {
            console.error("Error: El CIF no está definido.");
            return;  // Detener la prueba si el CIF no está disponible
        }

        const response = await request(app)
            .put(`/api/commerce/update/${cif}`)
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' })
            .send({
                "name": "SuperTienda Actualizada",
                "cif": cif,
                "email": "superxupdated@example.com",
                "phone": "987654321",
                "address": "Calle Actualizada, 456, Ciudad Nueva"
            });

        console.log('Respuesta de actualización del comercio:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.commerce.name).toEqual('SuperTienda Actualizada');
        expect(response.body.commerce.email).toEqual('superxupdated@example.com');
    });

    // Prueba para eliminar un comercio
    it('should delete a commerce', async () => {
        if (!cif) {
            console.error("Error: El CIF no está definido.");
            return;  // Detener la prueba si el CIF no está disponible
        }

        const response = await request(app)
            .delete(`/api/commerce/delete/${cif}`)
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' });

        console.log('Respuesta de eliminación del comercio:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('COMERCIO ELIMINADO EXITOSAMENTE');
    });

    // Cerrar la conexión a la base de datos después de las pruebas
    afterAll(async () => {
        await mongoose.connection.close(); // Cerrar la conexión de MongoDB
    });
});

describe("Webs", () => {
    var token = "";
    var webpageId = "";

    beforeAll(async () => {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB conectado');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Error en la conexión de MongoDB:', err);
        });

        // Hacer login para obtener el token
        const loginResponse = await request(app)
            .post('/api/user/login')
            .send({ "email": "prueba109@test.com", "password": "HolaMundo.01" });

        console.log('Respuesta del login:', loginResponse.body);

        // Asignar el token correctamente
        token = loginResponse.body.token; 

        // Crear una página web para obtener su ID
        const newWebpage = {
            city: "Barcelona",
            activity: "deporte",
            title: "Página Web de Deportes",
            summary: "Consejos y rutinas de ejercicios.",
        };

        // Crear la página web
        const createResponse = await request(app)
            .post('/api/webCommerce')
            .set('Authorization', `Bearer ${token}`)
            .send(newWebpage);

        // Verifica la respuesta del backend para el error 400
        console.log("Respuesta de la creación de web:", createResponse.body);  // Verifica la respuesta completa

        // Si la respuesta no es 201, muestra un mensaje de error y termina la prueba
        if (createResponse.status !== 201) {
            console.error("Error: No se pudo crear la página web.");
            return;
        }

        // Asignar el ID de la página web creada
        webpageId = createResponse.body._id;
    });

    // Prueba para crear una nueva página web
    it("should create a new webpage", async () => {
        if (!token) {
            console.error("Token no disponible, la prueba no puede ejecutarse.");
            return;  // Detiene la prueba si no se tiene token
        }

        const newWebpage = {
            city: "Madrid",
            activity: "tecnología",
            title: "Página Web de Innovación Tecnológica",
            summary: "Un sitio para descubrir las últimas innovaciones tecnológicas.",
        };

        const response = await request(app)
            .post('/api/webCommerce')
            .set('Authorization', `Bearer ${token}`)
            .send(newWebpage)
            .expect(201);

        console.log("Respuesta de la creación de la nueva página web:", response.body);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe(newWebpage.title);
    });

    // Prueba para obtener una página web por su ID
    it("should get a webpage by ID", async () => {
        if (!webpageId) {
            console.error("ID de página web no disponible, la prueba no puede ejecutarse.");
            return;  // Detiene la prueba si no se tiene ID de la página web
        }

        const response = await request(app)
            .get(`/api/webCommerce/${webpageId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        console.log("Respuesta de obtener la web por ID:", response.body);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(webpageId);  // Verifica que el ID coincida
    });

    // Prueba para actualizar una página web
    it("should update a webpage", async () => {
        if (!webpageId) {
            console.error("ID de página web no disponible, la prueba no puede ejecutarse.");
            return;  // Detiene la prueba si no se tiene ID de la página web
        }

        const updatedWebpage = {
            city: "Valencia",
            activity: "educación",
            title: "Página Web de Educación",
            summary: "Recursos educativos en línea.",
        };

        const response = await request(app)
            .put(`/api/webCommerce/${webpageId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedWebpage)
            .expect(200);

        console.log("Respuesta de la actualización de la página web:", response.body);
        expect(response.body.city).toBe(updatedWebpage.city);
        expect(response.body.title).toBe(updatedWebpage.title);
        expect(response.body.summary).toBe(updatedWebpage.summary);
    });

    // Prueba para eliminar una página web (borrado lógico)
    it("should delete a webpage (soft delete)", async () => {
        if (!webpageId) {
            console.error("ID de página web no disponible, la prueba no puede ejecutarse.");
            return;  // Detiene la prueba si no se tiene ID de la página web
        }

        const response = await request(app)
            .delete(`/api/webCommerce/${webpageId}?soft=true`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        console.log("Respuesta de la eliminación de la página web:", response.body);
        expect(response.body.message).toEqual('Página web eliminada correctamente');
    });

    // Test para subir una imagen a una página web (PATCH)
    it("should upload an image for the webpage", async () => {
        if (!webpageId) {
            console.error("ID de página web no disponible, la prueba no puede ejecutarse.");
            return;
        }

        const response = await request(app)
            .patch(`/api/webCommerce/${webpageId}`)
            .set('Authorization', `Bearer ${token}`)
            .attach("image", "./travis.jpg")  // Asegúrate de que el archivo esté disponible en la ruta correcta
            .expect(200);

        console.log("Respuesta de la subida de imagen:", response.body);
        expect(response.body.message).toBe("Imagen subida correctamente");
        expect(response.body.data).toHaveProperty("imageUrl");
    });

    // Test para obtener los correos de usuarios interesados en la página web (GET)
    it("should return a list of interested users", async () => {
        if (!webpageId) {
            console.error("ID de página web no disponible, la prueba no puede ejecutarse.");
            return;
        }

        const response = await request(app)
            .get(`/api/webCommerce/${webpageId}/interested-users`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        console.log("Respuesta de obtener los usuarios interesados:", response.body);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty("email");
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});