import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderEventType } from '../../domain/ports/order-publisher.port';

/**
 * DTO para representar un evento de orden.
 */
export class OrderEventDto {
    @IsString()
    @IsNotEmpty()
    readonly orderId: string;

    @IsEnum(OrderEventType)
    readonly type: OrderEventType;

    @ValidateNested()
    @Type(() => Object)
    readonly payload: unknown;

    constructor(orderId: string, type: OrderEventType, payload: unknown) {
        this.orderId = orderId;
        this.type = type;
        this.payload = payload;
    }
}

/**
 * DTO para el payload de evento ORDER_CREATED.
 */
export class OrderCreatedPayloadDto {
    @IsString()
    @IsNotEmpty()
    readonly customerId: string;

    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    readonly items: OrderItemDto[];
}

/**
 * DTO para representar un ítem de orden.
 */
export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    readonly productId: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly quantity: number;

    @IsNotEmpty()
    readonly price: number;
}

/**
 * DTO para el payload de evento ORDER_UPDATED.
 */
export class OrderUpdatedPayloadDto {
    @IsString()
    @IsNotEmpty()
    readonly newStatus: string;
}