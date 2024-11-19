import React,{useEffect, useState} from 'react';
import styles from '../assets/style/Login.module.scss';
import {useNavigate } from 'react-router-dom';
import Loading from '../Component/Loading.js';
import api from '../service/api';
import {useCookies} from 'react-cookie';

const Login = () => {
  const navigate = useNavigate();

    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookies, removeCookie]=useCookies(["rememberID","autoID"])
    const [isRemember, setIsRemember] = useState(false);
    const [loading, setLoading] = useState(false);
  
    //쿠키에 id 저장
    useEffect(() =>{
      if(cookies.rememberID !== undefined){
        setID(cookies.rememberID);
        //setid 호출해서 state 변수 id 값을 rememberid 에 설정
        setIsRemember(true);
        //state 값을 true 로 설정
      }
    },[cookies.rememberID]);

    const handleRemember = (e) => {
      setIsRemember(e.target.checked); // isRemember의 상태를 체크박스의 체크 여부와 일치시킴
      if (!e.target.checked) { // 체크박스가 체크되어 있지 않다면,
        removeCookie('rememberID'); // 쿠키 삭제
      } else if(isRemember){ // 체크박스가 체크되어있고, isRemember이 true라면
        setCookies("rememberID", id, { path: '/', expires: new Date(Date.now() + 604800000) });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await api.post('/user/login/',{
          email: id, 
          password: password
        });
        console.log('응답 데이터 : ', response.data);
    
        if (response.status === 200) {
          const { 'access-token': accessToken, email } = response.data;
          sessionStorage.setItem('token', accessToken);
          sessionStorage.setItem('email', email);
          setIsRemember(true);
          setCookies("rememberID", id, { path: '/', expires: new Date(Date.now() + 604800000) });
          alert('로그인 성공했습니다.😊');
          console.log("도킹이 완료됬다~ 이 말이야",response.data);
          navigate('/main');
        } else {
          console.error('응답 상태 코드가 200이 아닙니다:', response.status);
          alert('로그인이 실패했습니다.❌');
        }
      } catch (error) {
        if (error.response) {
          // error.response가 존재하면 에러 데이터를 확인
          console.error('응답 데이터 에러:', error.response.data);
          alert('로그인 실패! 응답이 잘못되었습니다.❌');
      } else if (error.request) {
          // 요청은 보냈으나 응답을 받지 못한 경우
          console.error('요청이 전송되었으나 응답이 없음:', error.request);
          alert('서버 응답이 없습니다.❌');
      } else {
          // 다른 에러
          console.error('로그인 에러:', error.message);
          alert('로그인 중 에러가 발생했습니다.❌');
      }
      } finally {
        setLoading(false);
      }
    };
    
    
  
    if (loading) {
      return <div><Loading /></div>;
    }
  function Sign(){
    navigate('/signup');
  }
  return (
 <>
 <div className={styles.Login_box}>
    <h2 className={styles.login}>UsTime</h2>
    <form className={styles.Login_form} onSubmit={handleSubmit}>
        <input type='text' 
               name='email' 
               placeholder='ID'
               value={id}
               onChange={(e) => setID(e.target.value)}>
        </input>

        <input type='password' 
               name='password' 
               placeholder='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}>

               </input>
        <label for='remember-check' className={styles.checkboxLabel}>
          <input id='remember-check' 
                 type='checkbox' 
                 className={styles.checkbox}
                 checked={isRemember}
                 onChange={handleRemember}>
                  </input>아이디 저장하기
        </label>
        <button type='submit' value='Login' className={styles.Login_button}>Login</button>
        <button type='button' onClick={Sign} value='SignUp' className={styles.Login_button}> 
          Sign Up
          </button>
    </form>

 </div>
 </>
  );
};

export default Login;