// JavaScript source code
const {log, biglog, errorlog, colorize} = require("./out");
const model = require('./model');

exports.helpCmd = rl => {
      log('Comandos');
	  log('h|help-Muestra esta ayuda');
      log('list- Listar los quizzes existentes');
	  log('show <id> -Muestra la pregunta y la respuesta el quiz indicado');
      log('add-A�adir un nuevo quiz interactivamente');
      log('delete <id> -Borrar el quiz indicado');
      log('edit <id> - Borrar el quiz indicado');
	  log('test <id> - Probar el quiz indicado');
      log('p|play -Jugar a preguntar aleatoriamente todos los quizzes');
	  log('credits -Creditos');
      log('q|quit -Salir del programa');
	  rl.prompt();
};

exports.listCmd = rl => {

     model.getAll().forEach((quiz, id)=> {
	  log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);

	 });


 rl.prompt();
};

exports.addCmd = rl => {
     rl.question(colorize('Introduzca una pregunta:', 'red'), question=>{
	 	 rl.question(colorize('Introduzca la respuesta:', 'red'), answer=>{
		 	 model.add(question, answer);
			 log(`${colorize('Se ha a�adido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			 rl.prompt();
		 });
	 });

};

exports.deleteCmd =(rl, id)=>{

 if (typeof id === "undefined"){
		errorlog('Falta el parametro id');
     } else{
	 	 try{
		 	 model.deleteByIndex(id);
		 } catch (error){
		 	 errorlog(error.message);

		 }
	 }
 rl.prompt();
 };

exports.editCmd = (rl, id) => {
   if (typeof id === "undefined"){
		errorlog('Falta el parametro id');
		rl.prompt();
	} else {
		try{
		const quiz = model.getByIndex(id);

		process.stdout.isTTY && setTimeout( () => {rl.write(quiz.question)},0);

          rl.question(colorize('Introduzca una pregunta:', 'red'), question=>{

		 	process.stdout.isTTY && setTimeout( () => {rl.write(quiz.answer)},0);

	 	  rl.question(colorize('Introduzca la respuesta:', 'red'), answer=>{
		   model.update(id, question, answer);
		   log(`Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
		   rl.prompt();
		  });
	     });
	    }catch(error){
		errorlog(error.message);
		rl.prompt();
	    }
    }
};

exports.testCmd = (rl,id) =>{
	   if (typeof id === "undefined"){
		errorlog('Falta el parametro id');
		rl.prompt();
	   } else {
		  try{
		  const quiz = model.getByIndex(id);
		  rl.question((quiz.question), answer => {
		  if((answer ||"").trim()=== quiz.answer){
				log("Correcto",'green');
				rl.prompt();
		   } else{
			  log ("Incorrecto", 'red');
			  rl.prompt();
			  }
		   });
		   }catch(error){
			errorlog(error.message);
			rl.prompt();
		   }
		}
};

exports.playCmd = rl =>{
	   
	 let score = 0;
	 let toBeResolved = [];
	 for(i=0; i++; i<model.length()){
	   toBeResolved[i]= model.getByIndex(i); 
	  }
	 const playOne = () =>{

	   if ( toBeResolved.length() === 0 ){
		  log ("No hay preguntas", 'red');
		  return score;
		  rl.prompt();
	   } else{
	       try{
		   let id = (Math.random()*toBeResolved.length());
		   let quiz = model.getByIndex(id);
		   delete(toBeResolved(id));
		   rl.question((quiz.question), answer => {
		    if((answer ||"").trim()=== quiz.answer){
				log("Correcto",'green');
				score ++;
				playOne();

		     } else{
			  log ("Incorrecto", 'red');
			  return score;
			  rl.prompt();
			 }
		   });
		  }catch(error){
		    errorlog(error.message);
			rl.prompt();
		   }
		 }
	  }
 
	 
};

exports.showCmd = (rl, id)=>{
	if (typeof id === "undefined"){
		errorlog('Falta el parametro id');
    } else{
	 	 try{
		 	 const quiz = model.getByIndex(id);
			 log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}` );
		 } catch (error){
		 	 errorlog(error.message);
		   }
	     }
	 rl.prompt();
};

exports.creditsCmd = rl =>{
	log('Autores de la practica:');
	 log('Cristina Rodriguez Beltran');
	 log('Ivan Martinez Ariza');
	 rl.prompt();
};
exports.quitCmd = rl =>{
	rl.close();
};