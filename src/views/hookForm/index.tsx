import { useForm, useWatch } from "react-hook-form";

export function Form() {
  const { handleSubmit, register ,control} = useForm({
    mode: 'onChange',
  });

  //  input输入监听回调
  const firstName = useWatch({
    name: "firstName",
    control,
    defaultValue : '456'
  })

  console.log('firstName123',firstName);
  

  return (
    <form
      onSubmit={handleSubmit((data) => console.log("form submitted", data))}
    >
      <input {...register("firstName")} placeholder="First Name" />
      <button type="submit">
        Save
      </button>
    </form>
  );
}

export default Form;