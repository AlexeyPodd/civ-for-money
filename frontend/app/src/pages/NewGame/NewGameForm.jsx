import { Button, Flex, FormControl, FormLabel, Input, FormErrorMessage, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Stack, Textarea, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';

export default function NewGameForm({
  onSubmit,
  rules,
  deleteRule,
  ruleIsDeleting,
  ruleIsDeleted,
  gameTypes,
  responseErrors,
  balanceWei,
  chosenRuleID,
}) {

  const fieldNames = [
    'title',
    'game',
    'bet',
    'betDenomination',
    'playPeriod',
    'playPeriodType',
    'rules',
    'rulesTitle',
    'rulesDescription',
  ]

  const {
    register,
    setValue,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { betDenomination: '18' } });

  function validateBalanceSufficient(value) {
    const bet = Math.floor(value * 10 ** getValues()[fieldNames[3]]);
    return bet <= balanceWei || 'Not enough money on balance.';
  }

  function validateBetIsBiggerThenZero(value) {
    const bet = Math.floor(value * 10 ** getValues()[fieldNames[3]]);
    return bet > 0 || 'Your bet can not be less then 1 wei.';
  }

  const rulesAreNew = watch('rules', 'create') === 'create';

  function setRuleData(event) {
    clearErrors("rulesTitle");
    clearErrors("rulesDescription");

    const currentRuleID = Number(event.target.value);
    for (let rule of rules) {
      if (rule.id === currentRuleID) {
        setValue('rulesTitle', rule.title);
        setValue('rulesDescription', rule.description);
        return;
      }
    }
    setValue('rulesTitle', '');
    setValue('rulesDescription', '');
  }

  useEffect(() => {
    if (chosenRuleID) {
      const chosenRule = rules.find(r => r.id === chosenRuleID);
      setValue('rules', chosenRuleID);      
      setValue('rulesTitle', chosenRule.title);
      setValue('rulesDescription', chosenRule.description);
    }
  }, [chosenRuleID])

  useEffect(() => {
    if (ruleIsDeleted) {
      setValue('rules', 'create');
      setValue('rulesTitle', '');
      setValue('rulesDescription', '');
    }
  }, [ruleIsDeleted]);

  useEffect(() => {
    responseErrors.serverError && setError('root.serverError', { message: responseErrors.serverError })
    for (let fieldName of fieldNames) {
      if (responseErrors[fieldName]) {
        setError(fieldName, { message: responseErrors[fieldName] });
      }
    }
  }, [responseErrors]);

  return (
    <Flex justify='center'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors && errors.root && errors.root.serverError
          && <Flex justify='center' color='red' bg='red.100'>
            {errors.root.serverError.message}
          </Flex>}

        <FormControl isRequired isInvalid={errors && errors[fieldNames[0]]} my="20px">
          <FormLabel>Title</FormLabel>
          <Input {...register(fieldNames[0])} focusBorderColor='#48BB78' />
          <FormErrorMessage>{errors[fieldNames[0]]?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={errors && errors[fieldNames[1]]} my="20px">
          <FormLabel>Game</FormLabel>
          <Select {...register(fieldNames[1])}>
            {gameTypes.map(gameType => <option value={gameType[0]} key={gameType[0]} >{gameType[1]}</option>)}
          </Select>
          <FormErrorMessage>{errors[fieldNames[1]]?.message}</FormErrorMessage>
        </FormControl>

        <Stack shouldWrapChildren direction='row' my="20px" w='100%'>
          <FormControl isRequired isInvalid={errors && errors[fieldNames[2]]}>
            <FormLabel>Bet</FormLabel>
            <NumberInput defaultValue={0.005} min={0} focusBorderColor='#48BB78'>
              <NumberInputField {...register(fieldNames[2], {
                validate: {
                  balanceSufficient: validateBalanceSufficient,
                  betIsBiggerThenZero: validateBetIsBiggerThenZero,
                }
              })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors[fieldNames[2]]?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Denomination</FormLabel>
            <Select {...register(fieldNames[3])}>
              <option value="0">Wei</option>
              <option value="3">Kwei</option>
              <option value="6">Mwei</option>
              <option value="9" >Gwei</option>
              <option value="12">Szabo</option>
              <option value="15">Finney</option>
              <option value="18">Ether</option>
              <option value="21">KEther</option>
              <option value="24">MEther</option>
              <option value="27">GEther</option>
              <option value="30">TEther</option>
            </Select>
            <FormErrorMessage>{errors[fieldNames[3]]?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack shouldWrapChildren direction='row' my="20px">
          <FormControl isRequired isInvalid={errors && errors[fieldNames[4]]}>
            <FormLabel>Game Duration</FormLabel>
            <NumberInput min={0} defaultValue={1} focusBorderColor='#48BB78'>
              <NumberInputField {...register(fieldNames[4], {min: 1})} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors[fieldNames[4]]?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Days / Hours</FormLabel>
            <Select {...register(fieldNames[5])}>
              <option value="3600">hour(s)</option>
              <option value="86400">day(s)</option>
            </Select>
            <FormErrorMessage>{errors[fieldNames[5]]?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <FormControl isRequired isInvalid={errors && errors[fieldNames[6]]} my="20px">
          <FormLabel>Rules</FormLabel>
          <Select {...register(fieldNames[6], { onChange: setRuleData })}>
            <option value="create">Create new</option>
            {rules.map(rule => <option key={rule.id} value={rule.id}>{rule.title}</option>)}
          </Select>
          <FormErrorMessage>{errors[fieldNames[6]]?.message}</FormErrorMessage>
        </FormControl>

        {!rulesAreNew
          && <Flex>
            <Button
              size="xs"
              colorScheme="red"
              ml='auto'
              onClick={() => deleteRule(watch(fieldNames[6]))}
              isLoading={ruleIsDeleting}
            >
              Delete this rules
            </Button>
          </Flex>
        }

        <FormControl isRequired isInvalid={errors && errors[fieldNames[7]]} my="20px">
          <Input {...register(fieldNames[7])} focusBorderColor='#48BB78' size='sm' placeholder="Rules Title" variant="flushed" />
          <FormErrorMessage>{errors[fieldNames[7]]?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors && errors[fieldNames[8]]} my="20px">
          <Textarea {...register(fieldNames[8])} focusBorderColor='#48BB78' size='sm' placeholder="Rules description..." />
          <FormErrorMessage>{errors[fieldNames[8]]?.message}</FormErrorMessage>
        </FormControl>

        <Button
          w='100%'
          size='lg'
          colorScheme="orange"
          type='submit'
        >
          Deploy
        </Button>

      </form>
    </Flex>
  )
}
