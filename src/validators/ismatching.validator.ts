import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
  } from 'class-validator';
  
  export function IsMatching(
    property: string,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isMatching',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            return value === relatedValue;
          },
          defaultMessage(args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            return `${propertyName} must match ${relatedPropertyName}`;
          },
        },
      });
    };
  }