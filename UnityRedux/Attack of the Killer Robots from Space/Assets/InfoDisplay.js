#pragma strict

public var CurrentHealth : float;
public var MaximumHealth : float;
public var CurrentAmmunition : uint;
public var MaximumAmmunition : uint;
public var IsVisible : boolean = true;

function Start () 
{
	
}

function OnGUI () 
{
	if(IsVisible)
	{
		GUI.Box(Rect(0,0,100,25), "Health: " + CurrentHealth + "/" + MaximumHealth);
		GUI.Box(Rect(0,25,100,25), "Ammo: " + CurrentAmmunition + "/" + MaximumAmmunition);
	}
}