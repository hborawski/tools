# DSL

The `@player-ui/dsl` package provides the primitives and build tools to create Player Asset Component libraries, and statically generate Player JSON content using TSX.

## Asset Component Libraries

Similar to React, Vue, or other component libraries, in order for users to take advantage of the JSX capabilities, they need a library of common components to pull from.

As an asset author, you can create and share a library of `Components` for content authors to import and leverage.

## DSL Schema

A `DSLSchema` type is provided in order be able to define the acceptable data types to be used and the validators to be defined for authoring the DSL data schema in our workspace. In the following example we'll generate everything we need for our DSLSchema type instance for checking based on the data types and validators available in the Player plugin `common-types-plugin`. For this purpose you can use some types and utilities found in the `@player-tools/dsl` package. 

We'll start out with generating the data types object properties and data type references:


```typescript
import { 
  DSLSchema, 
  getObjectReferences, 
  DataTypeReference, 
  ValidationRefProps 
} from '@player-tools/dsl'

import {
  dataTypes as coreDataTypes,
  validators as coreValidators
} from '@player-ui/common-types-plugin';

/** Grouping the data types into a new object, so we can also combine more type sets in the future */
const coreDataSet = {
  ...coreDataTypes
}

/** Abstracting the types set into their types */
type CoreDataTypes = typeof coreDataSet

/** Generating the data type property union */
type CoreDataTypeProps = keyof CoreDataTypes

/** Generating the data references types based in their types from above */
type CoreDataTypeRefs = {
  /** Property name with DataType object */
  [Property in keyof CoreDataTypes as `${Property}Ref`]: {
    /** DataType name */
    type: Property;
  };
};

/** Using getObjectReferences helper to generate the actual data type references */
export const dataRefs = getObjectReferences<CoreDataTypes, CoreDataTypeRefs>(
  coreDataSet
);
```

We'll proceed generating the validation object properties and validation function references with similar steps:


```typescript
/** Grouping the validator functions into a new object, so we can also combine more validator sets in the future */
const coreValidatorSet = {
  ...coreValidators
}

/** Generating the validator function references types based in their functions from above. Each validator ref will include its inherent required and optional own parameters, as well all properties that are part of the ValidationRefProps type*/
type CoreValidatorRefs = {
  /** Property name with validator ref object */
  [Property in keyof CoreValidatorTypes as `${Property}Ref`]: {
    /** Valiator name */
    type: Property;
  } & Parameters<CoreValidatorTypes[Property]>[2] &
    ValidationRefProps;
};

/** We generate the union type from the Validators Refs above*/
type CoreValidatorRefType = CoreValidatorRefs[keyof CoreValidatorRefs];

```

The final step is to put our generated data type properties union, and our validator function references union as generics for the `DataTypeReference` type which is the sole type we pass into the `DSLSchema` type instance:

```typescript
export type MyWorkspaceDSLSchema = DSLSchema<
  DataTypeReference<DataTypeProp, ValidatorRef>
>;
```

Finally this is how to use the schema: By adding the statement `satisfies` followed by your `DSLSchema` generated type, Typescript will show if there is anything not compliant with the data types and validation functions we defined in the schema:

```typescript
import { MyWorkspaceDSLSchema, dataRefs } from './MyTypes'

const { BooleanTypeRef } = dataRefs

const exampleSchema = {
  myDataSet = {
    firstPath: BooleanTypeRef
    secondPath: {
      /** To be able to define validator functions we need to elaborate the data reference object */
      type: 'TextType',
      validation: [
        {
          type: 'required',
          message: 'This field is required'
        }
      ]
    }
  }
} satisfies MyWorkspaceDSLSchema
```