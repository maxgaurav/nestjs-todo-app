import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match' })
export class MatchValidator implements ValidatorConstraintInterface {
  /**
   * Validate the value equals the comparison property
   * @param value
   * @param args
   */
  public validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;

    if (!args.object.hasOwnProperty(relatedPropertyName)) {
      return false;
    }

    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  /**
   * Message
   * @param args
   */
  public defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must match ${relatedPropertyName}`;
  }
}

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchValidator,
    });
  };
}
