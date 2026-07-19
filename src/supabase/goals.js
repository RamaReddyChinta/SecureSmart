import { supabaseRequest } from './client.js'
export const listGoals = token => supabaseRequest('/rest/v1/financial_goals?select=*&order=created_at.desc',{accessToken:token})
export const createGoal = (token,goal) => supabaseRequest('/rest/v1/financial_goals',{method:'POST',accessToken:token,body:goal,headers:{Prefer:'return=representation'}}).then(x=>x[0])
export const updateGoal = (token,id,goal) => supabaseRequest(`/rest/v1/financial_goals?id=eq.${id}`,{method:'PATCH',accessToken:token,body:goal,headers:{Prefer:'return=representation'}}).then(x=>x[0])
export const deleteGoal = (token,id) => supabaseRequest(`/rest/v1/financial_goals?id=eq.${id}`,{method:'DELETE',accessToken:token})
export const listContributions = (token,id) => supabaseRequest(`/rest/v1/goal_contributions?goal_id=eq.${id}&select=*&order=contributed_at.desc`,{accessToken:token})
export const addContribution = (token,goalId,amount,note) => supabaseRequest('/rest/v1/rpc/add_goal_contribution',{method:'POST',accessToken:token,body:{p_goal_id:goalId,p_amount:Number(amount),p_note:note||null}})
