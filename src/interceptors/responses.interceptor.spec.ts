import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { ResponseInterceptor } from './responses.interceptor';
import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';


describe('ResponseInterceptor (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule =
            await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalInterceptors(new ResponseInterceptor());

        await app.init();
    });

    it('should wrap response correctly', async () => {
        const response = await request(app.getHttpServer())
            .get('/')
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            data: null,
            message: 'Server Running...',
        });
    });

    afterAll(async () => {
        await app.close();
    });
});